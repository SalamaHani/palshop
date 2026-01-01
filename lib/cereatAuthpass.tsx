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

export async function createSession(session_id: any, user_id: any, shopify_customer_token: any, shopify_expires_at: any) {
    const db = (await clientPromise).db('palshop');
    const sessions = db.collection('sessions');
    const session = {
        session_id,
        user_id,
        shopify_customer_token,
        shopify_expires_at,
        createdAt: new Date()
    };
    await sessions.insertOne(session);
    return session;
}
export async function getSessionDB(session_id: any) {
    const db = (await clientPromise).db('palshop');
    const sessions = db.collection('sessions');
    const session = await sessions.findOne({ session_id });
    if (!session) return null;
    return {
        session_id: session.session_id,
        user_id: session.user_id,
        shopify_customer_token: session.shopify_customer_token,
        shopify_expires_at: session.shopify_expires_at,
        createdAt: session.createdAt
    };
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
export async function getUserByCustomerID(customerID: string) {
    const db = (await clientPromise).db('palshop');
    const users = db.collection('users');
    const user = await users.findOne({ customerID });
    if (!user) return null;
    return {
        id: user.customerID,
        email: user.email,
        password: user.password
    }
}
