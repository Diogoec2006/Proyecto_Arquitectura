interface KpiCardProps {
    label: string;
    data: number | string;
}

export default function KpiCard({ label, data }: KpiCardProps) {
    return (
        <div className="flex flex-col p-5 bg-white border border-gray-200 rounded-2xl shadow-xs">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2 truncate">
                {label}
            </h3>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                {data}
            </h2>
        </div>
    );
}