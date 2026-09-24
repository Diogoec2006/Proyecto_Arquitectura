import { NextRequest, NextResponse } from "next/server"
import { pool } from "../../lib/db"

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const sport = searchParams.get("sport");

        
        const sql = sport ? "SELECT * FROM courts WHERE sport = ?" : "SELECT * FROM courts"
        const params = sport ? [sport] : []

        const [rows] = await pool.execute(sql, params);
        const courts = rows as Court[];
        return NextResponse.json({ courts }, {status: 200})
    } catch (error) {
        console.error(error)
        return NextResponse.json({error: "Server Error"}, {status: 500})
    }
}