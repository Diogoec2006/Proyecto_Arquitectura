import KpiCard from "./KpiCard";

export default function KpiOverview({ kpiData }: {kpiData: KpiData}) {
    return (
        <section className="mb-10 px-6 sm:px-12 flex flex-col items-center w-full max-w-7xl">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 mb-6 self-start">
                Indicadores Clave de Rendimiento (KPIs)
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
                <KpiCard label="Total Usuarios" data={kpiData.total_signups} />
                <KpiCard label="Nuevos Usuarios" data={kpiData.new_signups} />
                <KpiCard label="Usuarios Bloqueados" data={kpiData.banned_users} />
                <KpiCard label="Total Reservas" data={kpiData.total_bookings} />
                <KpiCard label="% Cancelaciones" data={kpiData.cancelled_percentage ? `${kpiData.cancelled_percentage}%` : "0%"} />
                <KpiCard label="% Inasistencias" data={kpiData.no_show_percentage ? `${kpiData.no_show_percentage}%` : "0%"} />
            </div>
        </section>
    );
}