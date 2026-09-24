import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "../../lib/getUserId";
import { pool } from "../../lib/db";

export async function GET(req: NextRequest) {
    try {
        const userId = await getUserId(req);

        if (!userId) {
            return NextResponse.json({ error: "No autorizado. Inicia sesión para ver tus reservas." }, { status: 401 });
        }

        const sql = `
            SELECT b.booking_id, b.court_id, b.booked_date, b.booked_time, b.booking_status, 
                   b.payment_status, b.payment_method, b.payment_proof, b.price, b.created_at, c.court_name
            FROM bookings b
            JOIN courts c ON b.court_id = c.court_id
            WHERE b.user_id = ?
            ORDER BY b.created_at DESC, b.booked_date DESC, b.booked_time DESC
        `;
        const [rows] = await pool.execute(sql, [userId]);
        const reservations = rows as Reservation[];
        return NextResponse.json(reservations);

    } catch (error) {
        console.error("Error al obtener las reservas del usuario:", error);
        return NextResponse.json({ error: "Error en el servidor al consultar las reservas" }, { status: 500 });
    }
}