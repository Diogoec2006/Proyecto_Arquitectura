import { ChartConfig } from "../components/ui/chart";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const formatSportLabel = (sport: string) => {
  const s = String(sport).toLowerCase();
  if (s === "futbol5") return "Fútbol 5";
  if (s === "futbol7") return "Fútbol 7";
  if (s === "futbol11") return "Fútbol 11";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export function bookingsToDonut(d: BookingsBreakdownData): DonutChartInput {
  const entries: [keyof BookingsBreakdownData, string][] = [
    ["confirmed_bookings", "Confirmadas"],
    ["completed_bookings", "Completadas"],
    ["cancelled_bookings", "Canceladas"],
    ["no_show_bookings", "No asistió"],
  ];

  const data: DonutSlice[] = entries.map(([key, label], i) => ({
    name: label,
    value: d[key] || 0,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  })).filter(slice => slice.value > 0);

  const config: ChartConfig = Object.fromEntries(
    entries.map(([, label], i) => [
      label,
      { label, color: CHART_COLORS[i % CHART_COLORS.length] },
    ])
  );

  return { data, config };
}

export function sportsToDonut(rows: SportBreakdownData[]): DonutChartInput {
  const data: DonutSlice[] = rows.map((row, i) => ({
    name: formatSportLabel(row.sport),
    value: row.total || 0,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  })).filter(slice => slice.value > 0);

  const config: ChartConfig = Object.fromEntries(
    rows.map((row, i) => {
      const formatted = formatSportLabel(row.sport);
      return [
        formatted,
        { label: formatted, color: CHART_COLORS[i % CHART_COLORS.length] },
      ];
    })
  );

  return { data, config };
}