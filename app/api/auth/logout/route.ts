import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete("token");
        return NextResponse.json({ message: "Succesfully logged out" }, { status: 200 });
    } catch (error) {
        console.error("Error loging out: ", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    };
}