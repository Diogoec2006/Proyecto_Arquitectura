interface StatCardProps {
    bookingId: number;
    bookingStatus: string;
    customerName: string;
    isActive: boolean;
    setActiveCell: (isActive: number | null) => void;
}

const styleVariants: Record<string, string> = {
    confirmed: "bg-emerald-50 border border-emerald-200 text-emerald-800",
    completed: "bg-blue-50 border border-blue-200 text-blue-800",
    no_show: "bg-red-50 border border-red-200 text-red-500 line-through opacity-70",
    cancelled: "bg-gray-50 border border-gray-200 text-gray-400 line-through opacity-60"
};

const labelVariants: Record<string, string> = {
    confirmed: "Confirmada",
    completed: "Completada",
    no_show: "No asistió",
    cancelled: "Cancelada"
};

export default function StatusCard({ bookingId, bookingStatus, customerName, isActive, setActiveCell }: StatCardProps) {
    return (
        <div
            className={`rounded-xl px-2.5 py-1.5 cursor-pointer transition-all select-none shadow-2xs hover:shadow-xs ${styleVariants[bookingStatus] ?? "bg-gray-50 text-gray-700"}`}
            onClick={() => setActiveCell(isActive ? null : bookingId)}
        >
            <div className="font-bold text-xs truncate">{customerName}</div>
            <div className="text-[10px] font-semibold uppercase tracking-wider opacity-80 mt-0.5">{labelVariants[bookingStatus] ?? bookingStatus}</div>
        </div>
    );
}