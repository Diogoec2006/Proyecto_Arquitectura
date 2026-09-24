import { NextRequest, NextResponse } from "next/server";
import { pool } from "../../lib/db";
import { getUserId } from "../../lib/getUserId";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const startDate = searchParams.get("startDate");
        const days = Number(searchParams.get("days"));

        if (!days || !startDate) {
            return NextResponse.json({ error: "Faltan parámetros requeridos" }, { status: 400 });
        }

        // Mostrar slots ocupados: pending y confirmed bloquean el turno
        const sql = `SELECT court_id, booked_date, booked_time FROM bookings
                    WHERE booking_status IN ('pending', 'confirmed', 'completed') AND
                    booked_date BETWEEN ? AND
                    DATE_ADD(?, INTERVAL ? DAY)`;
        const [rows] = await pool.execute(sql, [startDate, startDate, days]);
        const bookings = rows as Partial<BookingRow>[];
        return NextResponse.json({ bookings }, { status: 200 });
    } catch (error) {
        console.error("Error al obtener reservas:", error);
        return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const userId = await getUserId(req);
        if (!userId) {
            return NextResponse.json({ error: "No autorizado. Inicia sesión para reservar." }, { status: 401 });
        }

        const { court_id, booked_date, booked_time, payment_proof } = await req.json();

        if (!court_id || !booked_date || !booked_time) {
            return NextResponse.json({ error: "Datos de reserva incompletos" }, { status: 400 });
        }

        // La reserva queda en estado 'pending' hasta que el admin confirme
        const sql = `INSERT INTO bookings 
            (user_id, court_id, booked_date, booked_time, booking_status, payment_status, payment_method, payment_proof, price) 
            VALUES (?, ?, ?, ?, 'pending', 'pending', 'transferencia_bancaria', ?, 15.00)`;
        await pool.execute(sql, [userId, court_id, booked_date, booked_time, payment_proof || null]);

        return NextResponse.json({ message: "Solicitud de reserva enviada. Pendiente de verificación." }, { status: 201 });
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            return NextResponse.json({ error: "Este turno ya ha sido reservado" }, { status: 409 });
        }
        console.error("Error al crear reserva:", error);
        return NextResponse.json({ error: "Error en el servidor al procesar la reserva" }, { status: 500 });
    }
}