"use client";

import { useEffect, useState } from "react";
import BookingConfirmation from "../../components/booking/BookingConfirmation";
import Link from "next/link";
import { BookingSummary } from "../../components/booking/BookingSummary";
import { useRouter } from "next/navigation";
import { Toaster } from "../../components/ui/sonner";
import { toast } from "sonner";
import { Banknote, ShieldCheck, Clock, Copy, CheckCircle2, AlertCircle } from "lucide-react";

const PRICE_PER_SLOT = 15; // USD

const BANK_ACCOUNTS = [
    { banco: "Banco Pichincha", tipo: "Ahorros", numero: "2213399388" },
    { banco: "Banco Pichincha", tipo: "Ahorros", numero: "2213028280" },
];

export default function ConfirmBooking() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [bookings, setBookings] = useState<UserBooking[] | null>(null);
    const [loadingFetch, setLoadingFetch] = useState(false);
    const [paymentProof, setPaymentProof] = useState("");
    const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

    useEffect(() => {
        const getBookings = () => {
            const storage = localStorage.getItem("pendingBookings");
            setBookings(storage ? JSON.parse(storage) : null);
            setLoading(false);
        };
        getBookings();

        window.addEventListener("focus", getBookings);
        return () => window.removeEventListener("focus", getBookings);
    }, []);

    useEffect(() => {
        if (!loading && (!bookings || bookings.length === 0)) {
            const timeout = setTimeout(() => router.push("/booking"), 500);
            return () => clearTimeout(timeout);
        }
    }, [bookings, loading, router]);

    const handleRemove = (booking: Omit<UserBooking, "court_id">) => {
        setBookings(prev => {
            if (!prev) return null;
            return prev.filter(b => !(
                b.court_name === booking.court_name && 
                b.booked_time === booking.booked_time && 
                b.booked_date === booking.booked_date
            ));
        });
        const storage = localStorage.getItem("pendingBookings");
        if (storage) {
            const parsed: UserBooking[] = JSON.parse(storage);
            const updated = parsed.filter(b => !(
                b.court_name === booking.court_name &&
                b.booked_time === booking.booked_time && 
                b.booked_date === booking.booked_date
            ));
            localStorage.setItem("pendingBookings", JSON.stringify(updated));
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedAccount(text);
            setTimeout(() => setCopiedAccount(null), 2000);
        });
    };

    const handleEnviarSolicitud = async () => {
        if (!bookings || bookings.length === 0) return;

        if (!paymentProof.trim()) {
            toast.error("Por favor ingresa el número de comprobante de transferencia para continuar.");
            return;
        }

        setLoadingFetch(true);
        try {
            const isBulk = bookings.length > 1;
            
            const payloadBookings = bookings.map(b => ({
                court_id: b.court_id,
                booked_date: b.booked_date,
                booked_time: b.booked_time,
                payment_proof: paymentProof.trim(),
            }));

            const res = await fetch(isBulk ? "/api/bookings/bulk" : "/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(isBulk ? payloadBookings : payloadBookings[0])
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.removeItem("pendingBookings");
                toast.success("¡Solicitud enviada! Tu reserva está en revisión.");
                setTimeout(() => {
                    router.push(`/reservations?success=true&amount=${bookings.length}`);
                }, 750);
            } else if (res.status === 401) {
                toast.error("Debes iniciar sesión para confirmar tu reserva.");
                setTimeout(() => {
                    router.push(`/login?redirectTo=${encodeURIComponent("/booking/confirm")}`);
                }, 1200);
            } else if (res.status === 409) {
                toast.error(data.error || "Uno o más turnos ya fueron reservados por otro usuario.");
            } else {
                toast.error(data.error || "Hubo un error al procesar la reserva. Intenta de nuevo.");
            }
        } catch {
            toast.error("Error de conexión al procesar la reserva.");
        } finally {
            setLoadingFetch(false);
        }
    };
    
    if (loading) {
        return (
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
                <p className="text-gray-500 font-medium">Cargando turnos seleccionados...</p>
            </div>
        );
    }

    const totalAmount = (bookings?.length ?? 0) * PRICE_PER_SLOT;

    return (
        <main className="min-h-[calc(100vh-80px)] bg-gray-50 py-6 px-4 sm:px-8 font-sans">
            {bookings && bookings.length > 0 && (
                <section className="max-w-7xl mx-auto flex rounded-3xl bg-white shadow-sm border border-gray-100 overflow-hidden min-h-[calc(100vh-120px)]">
                    <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 w-full">
                        
                        {/* Summary side */}
                        <BookingSummary bookings={bookings} />

                        <div className="hidden md:block self-stretch w-px bg-gray-100" />

                        {/* Instrucciones de pago y confirmación */}
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <div className="mb-6">
                                    <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                                        Paso Final
                                    </h2>
                                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
                                        Confirmar y Enviar Solicitud
                                    </h1>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Realiza la transferencia bancaria y envía tu comprobante. El administrador verificará y confirmará tu reserva.
                                    </p>
                                </div>

                                {/* Turnos seleccionados */}
                                <div className="mb-6">
                                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
                                        Turnos a Solicitar ({bookings.length})
                                    </h3>
                                    <div className="flex flex-col gap-3 max-h-48 overflow-y-auto pr-2">
                                        {bookings.map((booking, index) => (
                                            <div key={`${booking.court_id}-${booking.booked_date}-${booking.booked_time}`}>
                                                <BookingConfirmation
                                                    index={index}
                                                    courtName={booking.court_name}
                                                    date={booking.booked_date}
                                                    time={booking.booked_time}
                                                    handleRemove={handleRemove}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Datos bancarios */}
                                <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 mb-5">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Banknote className="w-5 h-5 text-emerald-700" />
                                        <h3 className="text-base font-bold text-emerald-900">
                                            Datos para Transferencia Bancaria
                                        </h3>
                                        <span className="ml-auto text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1">
                                            <ShieldCheck className="w-3.5 h-3.5" />
                                            Ecuador
                                        </span>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        {BANK_ACCOUNTS.map((acc) => (
                                            <div
                                                key={acc.numero}
                                                className="bg-white rounded-xl border border-emerald-200 px-4 py-3 flex items-center justify-between gap-3"
                                            >
                                                <div>
                                                    <p className="text-xs text-gray-500 font-medium">{acc.banco} · Cuenta {acc.tipo}</p>
                                                    <p className="text-base font-black text-gray-900 font-mono tracking-wider">{acc.numero}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => copyToClipboard(acc.numero)}
                                                    className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg transition-colors cursor-pointer bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                                >
                                                    {copiedAccount === acc.numero ? (
                                                        <><CheckCircle2 className="w-3.5 h-3.5" />Copiado</>
                                                    ) : (
                                                        <><Copy className="w-3.5 h-3.5" />Copiar</>
                                                    )}
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-4 flex items-start gap-2 text-xs text-emerald-800 bg-emerald-100 rounded-xl p-3">
                                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-700" />
                                        <span>
                                            Transfiere exactamente <strong>${totalAmount.toFixed(2)} USD</strong> a cualquiera de las cuentas y guarda el número de comprobante. Tu reserva quedará en estado <strong>Revisión Pendiente</strong> hasta que el administrador verifique el pago.
                                        </span>
                                    </div>
                                </div>

                                {/* Comprobante */}
                                <div className="mb-5">
                                    <label className="text-sm font-bold text-gray-800 block mb-2">
                                        Número de Comprobante de Transferencia <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ej: 00123456789"
                                        value={paymentProof}
                                        onChange={(e) => setPaymentProof(e.target.value)}
                                        className="w-full border border-gray-300 rounded-xl p-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 font-mono transition-all"
                                    />
                                    <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        El administrador revisará tu comprobante y confirmará la reserva en menos de 24 horas.
                                    </p>
                                </div>
                            </div>

                            {/* Botones */}
                            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div>
                                    <span className="text-xs text-gray-500 uppercase font-semibold">Total a transferir:</span>
                                    <div className="text-2xl font-black text-gray-900">
                                        ${totalAmount.toFixed(2)} <span className="text-base font-bold text-gray-500">USD</span>
                                    </div>
                                    <p className="text-xs text-gray-400">${PRICE_PER_SLOT} por hora × {bookings.length} turno(s)</p>
                                </div>

                                <div className="flex gap-3 w-full sm:w-auto">
                                    <Link
                                        href="/booking"
                                        className="flex-1 sm:flex-none text-center px-5 py-3 text-sm font-bold rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                                    >
                                        Cancelar
                                    </Link>

                                    <button
                                        disabled={loadingFetch}
                                        onClick={handleEnviarSolicitud}
                                        className="flex-1 sm:flex-none px-7 py-3 text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-50"
                                    >
                                        {!loadingFetch ? `Enviar Solicitud de Reserva` : "Enviando..."}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Toaster position="top-center" />
                </section>
            )}
        </main>
    );
}