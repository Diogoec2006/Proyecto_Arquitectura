import { motion } from "framer-motion"

interface TimeProps {
    booked?: boolean;
    index: number;
    courtId: number;
    date: string;
    time: string;
    selected?: boolean;
    handleSelect?: (booking: BookingSummary) => void;
}

export default function Time({ booked = false, index, courtId, date, time, selected, handleSelect }: TimeProps) {
    return booked ? (
        <motion.button
            disabled
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.025 }}
            className="w-16 h-10 text-base rounded-md font-semibold bg-gray-50 text-gray-300 line-through decoration-2 cursor-not-allowed"
        >
            {time}
        </motion.button>
    ) : (
        <motion.button
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.025 }}
            onClick={() => handleSelect!({court_id: courtId, booked_date: date, booked_time: time})}
            className={`w-16 h-10 text-base rounded-md font-semibold ${selected ? "text-green-800 bg-green-100 border-2 border-green-800 cursor-pointer" : "bg-green-50 text-green-700 cursor-pointer"}`}    
        >
            {time}
        </motion.button>
    )
}