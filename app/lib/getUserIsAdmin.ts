import { jwtVerify } from "jose"
import { NextRequest } from "next/server"

export async function getUserIsAdmin(req: NextRequest): Promise<boolean> {
    try {
        const token = req.cookies.get("token")?.value;

        if (!token) {return false};

        const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET_KEY));
        const role = payload.role as string;

        if (!role || role !== "admin") {
            return false;
        } else {
            return true
        }

    } catch {
        return false;
    }
}