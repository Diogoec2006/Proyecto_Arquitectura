import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return NextResponse.json({ authenticated: false });
    }

    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

    if (!JWT_SECRET_KEY) {
        console.error("JWT secret key is not defined");
        return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
    }

    try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET_KEY))
        return NextResponse.json({ authenticated: true, role: payload.role });
    } catch (error) {
        console.error(error)
        return NextResponse.json({ authenticated: false });
    }
}