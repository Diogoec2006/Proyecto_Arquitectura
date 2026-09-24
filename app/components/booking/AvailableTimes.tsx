import Time from "./Time";

interface AvailableTimesProps {
    today: Date | undefined;
    bookings: BookingSummary[];
    courts: Court[];
    date: string;
    selectedBookings: BookingSummary[];
    handleSelect: (booking: BookingSummary) => void;
}

const times = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];

export default function AvailableTimes({today, bookings, courts, date, selectedBookings, handleSelect} : AvailableTimesProps) {
    const isPast = (time: string) => {
        if (!today) return false;
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
        const isToday = date === todayStr;
        return isToday && today.getHours() >= parseInt(time.split(":")[0]);
    };

    if (!courts || courts.length === 0) {
        return (
            <div className="py-12 text-center text-gray-400">
                <p>No hay canchas disponibles para la categoría seleccionada.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 mb-8">
            {courts.map(court => (
                <div key={court.court_id} className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                            {court.court_name} <span className="text-xs font-normal text-gray-500">· Turnos de 1h</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(72px,max-content))] gap-2.5">
                        {times.map((time, index) => {
                            const existing = bookings.find(
                                b => b.booked_time === time && b.court_id === court.court_id
                            );
                            
                            const past = isPast(time);

                            return (
                                <Time
                                    key={time}
                                    index={index}
                                    time={time}
                                    date={existing ? existing.booked_date : date}
                                    courtId={court.court_id}
                                    booked={!!existing || past}
                                    selected={!existing && selectedBookings.some(
                                        b => b.court_id === court.court_id && b.booked_date === date && b.booked_time === time
                                    )}
                                    handleSelect={!existing ? handleSelect : undefined}
                                />
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}