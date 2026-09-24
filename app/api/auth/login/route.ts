import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { pool } from "../../../lib/db";
import { RowDataPacket } from "mysql2";
import { cookies } from "next/headers";
import { SignJWT } from "jose";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        const sqlSelect = "SELECT user_id, password_hash, role FROM users WHERE email = ?";
        const resultSelect = await pool.execute(sqlSelect, [email.toLowerCase()]);
        const rows = resultSelect[0] as RowDataPacket[];
 
        if (rows.length === 0) {
            return NextResponse.json({ message: "Wrong Email or Password" }, { status: 401 });
        }

        const user = rows[0];
        const matches = await bcrypt.compare(password, user.password_hash);

        if (!matches) {
            return NextResponse.json({ message: "Wrong Email or Password" }, { status: 401 });
        }
        
        const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

        if (!JWT_SECRET_KEY) {
            return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
        }

        const token = await new SignJWT({ userId: user.user_id, role: user.role })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("7d")
            .sign(new TextEncoder().encode(JWT_SECRET_KEY));
        
        const cookieStore = await cookies();
        cookieStore.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7
        });

        return NextResponse.json({ message: "Succesfully logged in" }, { status: 200 });

    } catch (error) {
        console.error("Error loging in: ", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    };
}