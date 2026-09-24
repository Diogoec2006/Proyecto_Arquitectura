import { useState } from "react";

const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export default function HeatMap({ heatMapMatrix, totalCourts }: { heatMapMatrix: Array<number[]>, totalCourts: number }) {
    const [tooltip, setTooltip] = useState<{
        count: number,
        x: number,
        y: number
    } | null>(null);

    return (
        <section className="flex flex-col gap-2 overflow-x-auto max-w-full pb-2">
            <div className="flex gap-1.5 items-center">
                <div className="w-10 sm:w-12 shrink-0" /> {/* spacer to align with day labels */}
                {Array.from({ length: 14 }, (_, i) => (
                    <div key={i} className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-[10px] sm:text-xs font-mono font-bold text-gray-500">
                        {i + 8}h
                    </div>
                ))}
            </div>
            {heatMapMatrix.map((dayTimes, dayIndex) => (
                <div key={dayIndex} className="flex items-center gap-1.5">
                    <span className="w-10 sm:w-12 text-center font-bold text-xs text-gray-600 shrink-0">{days[dayIndex]}</span>
                    <div className="flex gap-1.5">
                        {dayTimes.map((amountOfBookings, hourIndex) => {
                            if (hourIndex < 8 || hourIndex > 21) return null;
                            const occupancyRatio = totalCourts > 0 ? (amountOfBookings / totalCourts) : 0;
                            const opacity = amountOfBookings > 0 ? (0.2 + Math.min(occupancyRatio * 0.8, 0.8)) : 0.08;
                            return (
                                <div key={hourIndex}>
                                    <div 
                                        onMouseEnter={(e) => setTooltip({ count: amountOfBookings, x: e.clientX, y: e.clientY })}
                                        onMouseMove={(e) => setTooltip(prev => prev ? {...prev, x: e.clientX, y: e.clientY} : null)}
                                        onMouseLeave={() => setTooltip(null)}
                                        className="bg-emerald-600 w-6 h-6 sm:w-8 sm:h-8 rounded-lg cursor-pointer transition-transform hover:scale-110" 
                                        style={{ opacity: opacity }}
                                    />
                                    {tooltip && (
                                        <div 
                                            className="fixed bg-gray-900 text-white text-xs font-bold rounded-xl px-3 py-1.5 pointer-events-none shadow-xl z-50"
                                            style={{ left: tooltip.x + 12, top: tooltip.y - 35 }}
                                        >
                                            {tooltip.count} de {totalCourts} canchas ocupadas
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </section>
    );
}