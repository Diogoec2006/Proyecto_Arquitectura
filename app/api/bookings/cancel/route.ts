import { NextRequest, NextResponse } from "next/server";
import { pool } from "../../../lib/db";
import { getUserId } from "../../../lib/getUserId";
import { ResultSetHeader } from "mysql2";

export async function PATCH(req: NextRequest) {
    const userId = await getUserId(req);

    if (!userId) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    
    const { bookingId } = await req.json();

    if (!bookingId) {
        return NextResponse.json({ error: "Identificador de reserva faltante" }, { status: 400 });
    }

    try {
        const sql = "UPDATE bookings SET booking_status = 'cancelled' WHERE booking_id = ? AND user_id = ?";
        const [result] = await pool.execute<ResultSetHeader>(sql, [bookingId, userId]);
        
        if (result.affectedRows === 0) {
            return NextResponse.json({ error: "Reserva no encontrada o no pertenece al usuario" }, { status: 404 });
        }

        return NextResponse.json({ message: "Reserva cancelada exitosamente" }, { status: 200 });
    } catch (error) {
        console.error("Error al cancelar la reserva:", error);
        return NextResponse.json({ error: "Error en el servidor al cancelar la reserva" }, { status: 500 });
    }
}