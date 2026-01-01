
import { getSession } from "@/lib/auth";
import { getSessionDB } from "@/lib/cereatAuthpass";
export async function getSessionHelper() {
    const session = await getSession()
    if (!session?.session_id) return null;
    // fetch session from your DB
    const sessionDB = await getSessionDB(session.session_id); // your DB helper
    return sessionDB;
}