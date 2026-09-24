import { NextRequest, NextResponse } from "next/server"
import { pool } from "../../../lib/db"
import { getUserIsAdmin } from "../../../lib/getUserIsAdmin"

export async function GET(req: NextRequest) {
    try {
        if (!await getUserIsAdmin(req)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }
        
        const { searchParams } = new URL(req.url)
        const date = searchParams.get("date")
        const all = searchParams.get("all") // si all=true, trae todas las fechas con pendientes

        if (all === "true") {
            // Vista de comprobantes pendientes (todas las fechas)
            const sql = `
                SELECT b.booking_id, b.booked_time, b.booked_date, b.booking_status, 
                       b.payment_status, b.payment_method, b.payment_proof, b.price,
                       b.created_at, c.court_name, u.first_name, u.last_name, u.email
                FROM bookings b
                JOIN courts c ON b.court_id = c.court_id
                JOIN users u ON b.user_id = u.user_id
                WHERE b.booking_status = 'pending'
                ORDER BY b.created_at DESC
            `;
            const [rows] = await pool.execute(sql);
            const bookings = rows as AdminBooking[];
            return NextResponse.json({ bookings }, { status: 200 })
        }

        if (!date) {
            return NextResponse.json({ error: "Missing params"}, { status: 400 })
        }

        const sql = `
            SELECT b.booking_id, b.booked_time, b.booked_date, b.booking_status, 
                   b.payment_status, b.payment_method, b.payment_proof, b.price,
                   b.created_at, c.court_name, u.first_name, u.last_name, u.email
            FROM bookings b
            JOIN courts c ON b.court_id = c.court_id
            JOIN users u ON b.user_id = u.user_id
            WHERE b.booking_status != 'cancelled' AND b.booked_date = ?
            ORDER BY b.booked_time ASC
        `;

        const [rows] = await pool.execute(sql, [date]);
        const bookings = rows as AdminBooking[];
        
        return NextResponse.json({ bookings }, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Server Error" }, { status: 500 })
    }
}