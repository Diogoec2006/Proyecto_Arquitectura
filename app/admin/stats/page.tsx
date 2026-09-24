"use client";

import { useEffect, useState } from "react";
import DonutChart from "../../components/admin/DonutChart";
import { bookingsToDonut, sportsToDonut } from "../../lib/donut-chart-utils";
import KpiOverview from "../../components/admin/KpiOverview";
import HeatMap from "../../components/admin/HeatMap";
import DaysDropDown from "../../components/admin/DaysDropDown";

export default function AdminStatsPage() {
    const [kpiData, setKpiData] = useState<KpiData>();
    const [bookingsBreakdownData, setBookingsBreakdownData] = useState<BookingsBreakdownData>();
    const [sportsBreakdownData, setSportsBreakdownData] = useState<SportBreakdownData[]>();
    const [heatMapMatrix, setHeatMapMatrix] = useState<Array<number[]>>();
    const [totalCourts, setTotalCourts] = useState<number>();
    
    const [days, setDays] = useState<number>(() => {
        if (typeof window === "undefined") return 90;
        const stored = localStorage.getItem("days");
        return stored ? Number(stored) : 90;
    });

    const [customFromTo, setCustomFromTo] = useState<{from: string, to: string} | null>(() => {
        if (typeof window === "undefined") return null;
        const stored = localStorage.getItem("customFromTo");
        try {
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const to = customFromTo?.to ?? new Date().toISOString().split('T')[0];
                const from = customFromTo?.from ?? new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                const res = await fetch(`/api/admin/stats?from=${from}&to=${to}`);
                if (res.ok) {
                    const data: AdminData = await res.json();
                    setKpiData(data.kpiData);
                    setBookingsBreakdownData(data.bookingsBreakdownData);
                    setSportsBreakdownData(data.sportsBreakdownData);
                    setHeatMapMatrix(data.heatMapData.heatMapMatrix);
                    setTotalCourts(data.heatMapData.totalCourts);
                }
            } catch (err) {
                console.error("Error al cargar estadísticas:", err);
            }
        };
        fetchStats();
    }, [days, customFromTo]);

    const bookingsChart = bookingsBreakdownData ? bookingsToDonut(bookingsBreakdownData) : null;
    const sportsChart = sportsBreakdownData ? sportsToDonut(sportsBreakdownData) : null;

    useEffect(() => {
        localStorage.setItem("days", String(days));
    }, [days]);

    useEffect(() => {
        if (customFromTo === null) {
            localStorage.removeItem("customFromTo");
        } else {
            localStorage.setItem("customFromTo", JSON.stringify(customFromTo));
        }
    }, [customFromTo]);

    return (
        <main className="flex flex-col items-center w-full min-h-screen bg-gray-50 py-8 px-4 sm:px-8 font-sans">
            <div className="w-full max-w-7xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Métricas y Estadísticas</h1>
                    <p className="text-sm text-gray-500 mt-1">Análisis de rendimiento, ocupación y actividad de las 10 canchas</p>
                </div>
                <DaysDropDown setDays={setDays} days={days} setCustomFromTo={setCustomFromTo} />
            </div>

            {kpiData && <KpiOverview kpiData={kpiData} />}

            <section className="flex flex-wrap justify-center gap-6 w-full max-w-7xl mb-8">
                <DonutChart
                    label="Desglose por Estado de Reservas"
                    data={bookingsChart?.data ?? []}
                    config={bookingsChart?.config ?? {}}
                />
                <DonutChart
                    label="Desglose por Categoría Deportiva"
                    data={sportsChart?.data ?? []}
                    config={sportsChart?.config ?? {}}
                />
            </section>

            <div className="w-full max-w-7xl p-6 sm:p-8 bg-white rounded-3xl border border-gray-200 shadow-xs flex flex-col items-center">
                <div className="self-start mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Mapa de Calor de Ocupación por Horas</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Distribución de turnos jugados a lo largo de la semana</p>
                </div>
                {(heatMapMatrix && totalCourts !== undefined) && <HeatMap heatMapMatrix={heatMapMatrix} totalCourts={totalCourts} />}
            </div>
        </main>
    );
}