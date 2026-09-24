"use client";

import { useEffect, useState } from "react";
import { Calendar } from "../components/ui/calendar";
import AvailableTimes from "../components/booking/AvailableTimes";
import { useRouter } from "next/navigation";
import SportsSelection from "../components/booking/SportsSelection";

const MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

export default function BookingPage() {
    const router = useRouter();
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [bookings, setBookings] = useState<BookingSummary[]>([]);
    const [allCourts, setAllCourts] = useState<Court[]>([]);
    const [courts, setCourts] = useState<Court[]>([]);
    
    const [selectedSport, setSelectedSport] = useState(() => {
        if (typeof window === "undefined") return "futbol5";
        return localStorage.getItem("selectedSport") ?? "futbol5";
    });

    const [selectedBookings, setSelectedBookings] = useState<BookingSummary[]>([]);
    const highlightedDates = [...new Set(selectedBookings.map(booking => booking.booked_date))].map(dateStr => new Date(dateStr + "T00:00:00"));

    const dateLabel = date ? `${date.getDate()} de ${MONTHS[date.getMonth()]}, ${date.getFullYear()}` : "Selecciona una fecha";
    const formattedDate = date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}` : "";
    const bookedBookings = bookings.filter((booking) => booking.booked_date === formattedDate);

    const sports = [...new Set(allCourts.map((court) => court.sport))];

    const handleSelect = (booking: BookingSummary) => {
        setSelectedBookings(prev => {
            const exists = prev.some(s => 
                s.court_id === booking.court_id && 
                s.booked_time === booking.booked_time && 
                s.booked_date === booking.booked_date
            );
            if (exists) {
                return prev.filter(s => !(
                    s.court_id === booking.court_id && 
                    s.booked_time === booking.booked_time && 
                    s.booked_date === booking.booked_date
                ));
            }
            if (selectedBookings.length >= 20) return prev;
            return [...prev, booking];
        });
    };

    const getBookings = async (fromDate?: Date) => {
        const d = fromDate ?? new Date();
        const formattedCurrentDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        const res = await fetch(`/api/bookings?startDate=${formattedCurrentDate}&days=40`);
        if (!res.ok) return [];
        const { bookings: fetchedBookings }: { bookings: BookingSummary[] } = await res.json();
        fetchedBookings.forEach(booking => booking.booked_time = booking.booked_time.slice(0, 5));
        return fetchedBookings;
    };

    const getCourts = async () => {
        const res = await fetch(`/api/courts`);
        if (!res.ok) return [];
        const { courts: fetchedCourts }: { courts: Court[] } = await res.json();
        return fetchedCourts;
    };
    
    const handleConfirmation = () => {
        const pendingBookings: UserBooking[] = selectedBookings.map((booking) => ({
            ...booking,
            court_name: allCourts.find((c) => c.court_id === booking.court_id)?.court_name ?? "Cancha",
            price: 60000,
        }));
        localStorage.setItem("pendingBookings", JSON.stringify(pendingBookings));
        router.push("/booking/confirm");
    };

    useEffect(() => {
        const fetchData = async () => {
            const fetchedBookings = await getBookings();
            setBookings(fetchedBookings);
            const fetchedCourts = await getCourts();
            setAllCourts(fetchedCourts);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const filterCourts = () => {
            const filteredCourts = allCourts.filter(court => court.sport.toLowerCase() === selectedSport.toLowerCase());
            setCourts(filteredCourts);
        };
        filterCourts();
    }, [selectedSport, allCourts]);

    useEffect(() => {
        localStorage.setItem("selectedSport", selectedSport);
    }, [selectedSport]);

    return (
        <main className="relative min-h-[calc(100vh-80px)] bg-slate-950 py-8 px-4 sm:px-8 overflow-hidden font-sans">
            {/* Background Stadium Atmosphere with Vignette */}
            <div 
                aria-hidden="true" 
                className="absolute inset-0 bg-cover bg-center opacity-25 filter brightness-75 pointer-events-none"
                style={{ backgroundImage: "url('/stadium-bg.jpg')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-slate-950/90 pointer-events-none" />

            <section className="relative z-10 max-w-7xl mx-auto flex rounded-3xl bg-white/95 backdrop-blur-md shadow-2xl border border-white/20 overflow-hidden min-h-[calc(100vh-120px)]">
                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 w-full">

                    {/* Left Sidebar: Sport & Date Picker */}
                    <div className="w-full md:w-2/5 lg:w-fit shrink-0 self-start">
                        <div className="mb-6">
                            <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">1. Deporte</h2>
                            <SportsSelection sports={sports.length ? sports : ["futbol5"]} selectedSport={selectedSport} setSelectedSport={setSelectedSport} />
                        </div>

                        <div>
                            <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">2. Selecciona la Fecha</h2>
                            <div className="border border-gray-100 rounded-2xl p-2 bg-gray-50/50 shadow-inner">
                                <Calendar
                                    onMonthChange={(month) => { getBookings(month).then(setBookings); }}
                                    modifiers={{ highlighted: highlightedDates }}
                                    modifiersClassNames={{ highlighted: "bg-emerald-600/80 text-white rounded-md hover:bg-emerald-700 [&_button]:hover:bg-emerald-600" }}
                                    disabled={{ before: new Date() }}
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    className="rounded-xl [&_.rdp-day_button]:text-base [--cell-size:--spacing(9)]"
                                    classNames={{
                                        weekday: "flex-1 rounded-md text-sm font-semibold text-gray-400 select-none",
                                        caption_label: "text-base font-bold text-gray-800",
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Area: Court Slots */}
                    <div className="flex flex-col flex-1 md:border-l md:border-gray-100 md:pl-8">
                        <div className="mb-4">
                            <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-wider">3. Horarios Disponibles</h2>
                            <h1 className="font-black text-2xl sm:text-3xl text-gray-900 mt-1 title-glow-hover cursor-default">{dateLabel}</h1>
                            <p className="text-sm text-gray-500 mt-0.5">Selecciona los turnos que deseas reservar y luego procede al pago</p>
                        </div>

                        <div className="overflow-y-auto max-h-[60vh] pr-2">
                            <AvailableTimes
                                today={new Date()}
                                bookings={bookedBookings}
                                courts={courts}
                                date={formattedDate}
                                selectedBookings={selectedBookings}
                                handleSelect={handleSelect}
                            />
                        </div>

                        {/* Footer Bar */}
                        <div className="mt-auto flex flex-col sm:flex-row justify-between items-center border-t border-gray-100 py-4 gap-4 sticky bottom-0 bg-white">
                            <div className="flex items-center text-sm">
                                <span className="font-semibold text-gray-700">
                                    {selectedBookings.length >= 20 && "Límite máximo — "}
                                    {selectedBookings.length} {selectedBookings.length === 1 ? "turno seleccionado" : "turnos seleccionados"}
                                </span>
                                {selectedBookings.length > 0 && (
                                    <button
                                        onClick={() => setSelectedBookings([])}
                                        className="text-red-500 hover:text-red-700 font-medium ml-3 cursor-pointer transition-colors"
                                    >
                                        Limpiar selección
                                    </button>
                                )}
                            </div>
                            
                            <button
                                disabled={selectedBookings.length === 0}
                                onClick={() => handleConfirmation()}
                                className={`w-full sm:w-auto px-8 py-3 text-base font-bold rounded-xl transition-all shadow-sm ${
                                    selectedBookings.length === 0 
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                        : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20 hover:-translate-y-0.5 cursor-pointer"
                                }`}
                            >
                                Continuar a Confirmación y Pago ({selectedBookings.length})
                            </button>
                        </div>
                    </div>

                </div>
            </section>
        </main>
    );
}
