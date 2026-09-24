import Link from "next/link";
import { SummaryField } from "./SumnmaryField";

const PRICE_PER_SLOT = 15; // USD

export function BookingSummary({ bookings } : { bookings: UserBooking[] }) {
    const totalSlots = bookings?.length ?? 0;
    const uniqueCourts = [...new Set(bookings.map((booking) => booking.court_name))].join(", ");

    const dates = [...new Set(bookings.map((booking) => booking.booked_date))];
    const formattedDates = dates.map(date => new Date(date + "T00:00:00").toLocaleDateString("es-EC", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric"
    })).join("\n");

    const totalPrice = totalSlots * PRICE_PER_SLOT;

    return (
        <div className="w-full md:w-1/3 flex flex-col bg-emerald-50/40 p-6 rounded-3xl border border-emerald-100">
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                Resumen del Pedido
            </div>
            <div className="text-2xl font-black text-gray-900 mb-6">
                {totalSlots} {totalSlots === 1 ? "turno seleccionado" : "turnos seleccionados"}
            </div>

            <div className="flex flex-col gap-4">
                <SummaryField label="Fechas" value={formattedDates || "Ninguna"} />
                <SummaryField label="Duración Total" value={`${totalSlots} hora${totalSlots !== 1 ? "s" : ""}`} />
                <SummaryField label="Canchas" value={uniqueCourts || "Ninguna"} />
                
                <div className="pt-4 border-t border-emerald-200 mt-2">
                    <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">
                        Valor Total
                    </div>
                    <div className="text-2xl font-black text-emerald-700">
                        ${totalPrice.toFixed(2)} USD
                    </div>
                    <p className="text-xs text-gray-500 mt-1">(${PRICE_PER_SLOT}.00 USD por hora/cancha)</p>
                </div>
            </div>

            <div className="mt-8 pt-4 border-t border-emerald-100">
                <Link
                    href="/booking"
                    className="text-gray-600 hover:text-emerald-700 text-sm font-bold flex items-center gap-2 transition-colors"
                >
                    ← Modificar selección
                </Link>
            </div>
        </div>
    );
}