import clientPromise from './mongodb';

async function connectDB() {
    return (await clientPromise).db('palshop');
}

export async function createUser(email: string, password: string, customerID: string) {
    const db = await connectDB();
    const users = db.collection('users');
    // Generate unique customerID
    // Create user document
    const user = {
        customerID,
        email,
        password,
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
