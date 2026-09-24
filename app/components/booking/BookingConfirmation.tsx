import { useState } from "react";
import { motion } from "framer-motion";

interface BookingConfirmationProps {
    index: number;
    courtName: string;
    date: string;
    time: string;
    handleRemove: (booking: Omit<UserBooking, "court_id">) => void;
}

export default function BookingConfirmation({index, courtName, date, time, handleRemove}: BookingConfirmationProps) {
    const [confirmPending, setConfirmPending] = useState(false);
    
    const formattedDate = new Date(date + "T00:00:00").toLocaleDateString("es-CO", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
    
    const formattedTime = `${time} - ${String((parseInt(time) + 1) % 24).padStart(2, "0")}:00`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.05 }}
            className="flex justify-between items-center bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100 hover:border-emerald-200 transition-all"
        >
            <div className="flex items-center gap-4">
                <div
                    className="px-3 py-2 text-sm md:text-base rounded-xl font-bold bg-emerald-100 text-emerald-800 shrink-0 font-mono"
                >
                    {formattedTime}
                </div>
                <div className="flex flex-col">
                    <h3 className="font-bold text-gray-900 md:text-base">{courtName}</h3>
                    <h4 className="text-xs md:text-sm text-gray-500 capitalize">{formattedDate}</h4>
                </div>
            </div>
            
            <button 
                title={confirmPending ? "Clic de nuevo para quitar" : "Quitar turno"}
                onClick={() => {
                    if (confirmPending) {
                        handleRemove({court_name: courtName, booked_date: date, booked_time: time});
                    } else {
                        setConfirmPending(true);
                    }
                }}
                onBlur={() => setConfirmPending(false)}
                className={`p-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                    confirmPending ? "bg-red-500 text-white" : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                }`}
            >
                {confirmPending ? "¿Quitar?" : "✕"}
            </button>
        </motion.div>
    );
}