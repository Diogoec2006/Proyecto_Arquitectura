"use client";

import { useCallback, useEffect, useState } from "react";
import DateTab from "../../components/admin/DateTab";
import { toast } from "sonner";
import { Toaster } from "../../components/ui/sonner";
import Tabel from "../../components/admin/Tabel";
import SportsDropdown from "../../components/admin/SportsDropdown";

const times = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];

type DateTabType = "today" | "tomorrow" | "pick";
const dateToStr = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export default function AdminBookings() {
    const [activeTab, setActiveTab] = useState<DateTabType>("today");
    const [activeCell, setActiveCell] = useState<number | null>(null);
    const [pickedDate, setPickedDate] = useState(dateToStr(new Date()));
    const [bookings, setBookings] = useState<AdminBooking[]>([]);
    const [courts, setCourts] = useState<Court[]>([]);
    const [selectedSport, setSelectedSport] = useState("futbol5");

    const fetchBookings = useCallback(async () => {
        try {
            const res = await fetch(`/api/admin/bookings?date=${pickedDate}`);

            if (res.ok) {
                const { bookings: fetchedBookings } : { bookings: AdminBooking[] } = await res.json();
                fetchedBookings.forEach(booking => {
                    booking.booked_time = booking.booked_time.slice(0, 5);
                    booking.first_name = booking.first_name.charAt(0).toUpperCase() + booking.first_name.slice(1);
                    booking.last_name = booking.last_name.charAt(0).toUpperCase() + booking.last_name.slice(1);
                });
                setBookings(fetchedBookings);
            } else {
                toast.error("No se pudieron cargar las reservas del administrador.");
            }
        } catch {
            toast.error("Error de conexión al cargar las reservas.");
        }
    }, [pickedDate]);

    const updateStatus = async (bookingId: number, status: string) => {
        try {
            const res = await fetch("/api/admin/bookings/status", { 
                method: "PATCH", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookingId, status }) 
            });

            if (res.ok) {
                toast.success("Estado de la reserva actualizado.");
                await fetchBookings();
            } else {
                toast.error("No se pudo actualizar el estado de la reserva.");
            }
            
        } catch {
            toast.error("Error de conexión al actualizar estado.");
        }
        setActiveCell(null);
    };

    useEffect(() => {
        const fetchCourts = async () => {
            try {
                const res = await fetch("/api/courts");

                if (res.ok) {
                    const { courts: fetchedCourts } : { courts: Court[] } = await res.json();
                    setCourts(fetchedCourts);
                } else {
                    toast.error("Error al cargar la lista de canchas.");
                }

            } catch {
                toast.error("Error de conexión al cargar canchas.");
            }
        };

        fetchCourts();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            await fetchBookings();
        };
        fetchData();
    }, [fetchBookings]);

    const getBooking = (court: Court, time: string): AdminBooking | undefined => {
        return bookings?.find(booking => booking.court_name === court.court_name && booking.booked_time === time);
    };

    const setTomorrowsDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setPickedDate(dateToStr(tomorrow));
    };

    const filteredCourts = courts.filter(court => court.sport.toLowerCase() === selectedSport.toLowerCase());

    return (
        <main className="min-h-screen bg-gray-50 font-sans py-8">

            <div className="px-6 max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-black text-gray-900">Panel de Administración de Reservas</h1>
                    <p className="text-sm text-gray-500 mt-1">Supervisa y actualiza el estado de las 10 canchas en tiempo real</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 mb-6 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
                    <DateTab type="today" active={activeTab === "today"} onClick={() => { setActiveTab("today"); setPickedDate(dateToStr(new Date())); }} />

                    <DateTab type="tomorrow" active={activeTab === "tomorrow"} onClick={() => { setActiveTab("tomorrow"); setTomorrowsDate(); }} />

                    <DateTab type="pick" active={activeTab === "pick"} onClick={() => setActiveTab("pick")} pickedDate={pickedDate} onPickedDate={setPickedDate} />

                    <div className="ml-auto">
                        <SportsDropdown sports={[...new Set(courts.map(court => court.sport))]} selectedSport={selectedSport} setSelectedSport={setSelectedSport} />
                    </div>
                </div>
                

                <div className="hidden lg:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
                    <Tabel
                        courts={filteredCourts.length ? filteredCourts : courts}
                        times={times}
                        activeCell={activeCell}
                        getBooking={getBooking}
                        setActiveCell={setActiveCell}
                        updateStatus={updateStatus}
                    />
                </div>

                {/* Mobile fallback */}
                <div className="block lg:hidden p-8 text-center text-gray-500 bg-white rounded-2xl border border-gray-200">
                    <p className="font-bold text-gray-700">La cuadrícula de administración está optimizada para pantallas grandes.</p>
                    <p className="text-sm mt-1">Por favor utiliza un dispositivo con pantalla más ancha para gestionar la tabla de turnos.</p>
                </div>

            </div>
            <Toaster position="top-center" />
        </main>
    );
}