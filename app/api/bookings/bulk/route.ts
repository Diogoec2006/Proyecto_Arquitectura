import { NextResponse, NextRequest } from "next/server";
import { getUserId } from "../../../lib/getUserId";
import { pool } from "../../../lib/db";

export async function POST(req: NextRequest) {
    try {
        const userId = await getUserId(req);
        if (!userId) {
            return NextResponse.json({ error: "No autorizado. Inicia sesión para reservar." }, { status: 401 });
        }

        const body = await req.json();
        const bookings: { 
            court_id: number; 
            booked_date: string; 
            booked_time: string; 
            payment_proof?: string;
        }[] = Array.isArray(body) ? body : body.bookings;

        if (!Array.isArray(bookings) || bookings.length === 0 || bookings.length > 20) {
            return NextResponse.json({ error: "Entrada inválida de reservas" }, { status: 400 });
        }

        // Todos comparten el mismo comprobante (vienen de la misma solicitud)
        const payment_proof = bookings[0]?.payment_proof || null;

        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            for (const booking of bookings) {
                await connection.execute(
                    `INSERT INTO bookings 
                        (user_id, court_id, booked_date, booked_time, booking_status, payment_status, payment_method, payment_proof, price) 
                     VALUES (?, ?, ?, ?, 'pending', 'pending', 'transferencia_bancaria', ?, 15.00)`,
                    [userId, booking.court_id, booking.booked_date, booking.booked_time, payment_proof]
                );
            }
            await connection.commit();
            
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            await connection.rollback();
            if (error.code === 'ER_DUP_ENTRY') {
                return NextResponse.json({ error: "Uno o más turnos ya se encuentran reservados" }, { status: 409 });
            }
            throw error;
        } finally {
            connection.release();
        }

        return NextResponse.json({ message: "Solicitud de reserva enviada. Pendiente de verificación del comprobante." }, { status: 201 });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            return NextResponse.json({ error: "Uno o más turnos ya han sido reservados por otro usuario" }, { status: 409 });
        }
        console.error("Error al procesar reservas múltiples:", error);
        return NextResponse.json({ error: "Error en el servidor al confirmar las reservas" }, { status: 500 });
    }
}