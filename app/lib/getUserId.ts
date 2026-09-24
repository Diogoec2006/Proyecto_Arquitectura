import { jwtVerify } from "jose"
import { NextRequest } from "next/server"

export async function getUserId(req: NextRequest): Promise<number | null> {
    try {
        const token = req.cookies.get("token")?.value;

        if (!token) {return null};

        const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET_KEY));
        return payload.userId as number;

    } catch {
        return null;
    }
}