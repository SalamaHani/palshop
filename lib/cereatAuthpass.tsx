// lib/auth.ts
import clientPromise from './mongodb';
export async function createUser(email: string, password: string, customerID: string) {
    const db = (await clientPromise).db('palshop');
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
    const db = (await clientPromise).db('palshop');
    const users = db.collection('users');
    const user = await users.findOne({ email });
    if (!user) return null;
    return {
        id: user.customerID,
        email: user.email,
        password: user.password
    };
}
