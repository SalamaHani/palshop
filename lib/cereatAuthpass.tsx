import clientPromise from './mongodb';

async function connectDB() {
    return (await clientPromise).db('palshop');
}

export async function createUser(email: string) {
    const db = await connectDB();
    const users = db.collection('users');
    // Check if email already exists
    const existing = await users.findOne({ email });
    if (existing) throw new Error('Email already exists');

    // Generate unique customerID
    const customerID = crypto.randomUUID();

    // Hash the password
    function generateSecurePassword(): string {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        let password = '';
        const array = new Uint32Array(32);
        crypto.getRandomValues(array);
        for (let i = 0; i < 32; i++) {
            password += chars[array[i] % chars.length];
        }
        return password;
    }
    // Create user document
    const user = {
        customerID,
        email,
        password: generateSecurePassword(),
        createdAt: new Date()
    };
    // Insert into MongoDB
    await users.insertOne(user);
    return user;
}

// Optional: get user by email
export async function getUserByEmail(email: string) {
    const db = await connectDB();
    const users = db.collection('users');
    return await users.findOne({ email });
}
