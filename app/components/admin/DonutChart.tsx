"use client";

import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "../../components/ui/chart";
import { PieChart, Pie } from "recharts";
import { ChartConfig } from "../../components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface DonutChartProps {
	label: string;
	config: ChartConfig;
	data: {
		name: string;
		value: number;
		fill: string;
	}[];
}

export default function DonutChart({label, config, data}: DonutChartProps) {
    const isEmpty = data.length === 0;

    // Placeholder data to render a gray ring
    const displayData = isEmpty
        ? [{ name: "Sin datos", value: 1, fill: "var(--color-gray-300)" }]
        : data;
    const displayConfig = isEmpty ? {} : config;

    return (
        <Card className={`w-88 md:w-fit max-w-full overflow-hidden rounded-3xl shadow-xs border-gray-200 ${isEmpty ? "opacity-60" : ""}`}>
            <CardHeader className="self-start flex flex-col pb-2">
                <CardTitle className="text-base font-bold text-gray-900">{label}</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={displayConfig} className="h-72 w-full max-w-full min-w-0">
                    <PieChart>
                        <Pie
                            data={displayData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={60}
                            outerRadius={95}
                            paddingAngle={isEmpty ? 0 : 3}
                            isAnimationActive={false}
                        />
                        {!isEmpty && <ChartTooltip content={<ChartTooltipContent />} />}
                        {!isEmpty && <ChartLegend className="flex flex-wrap text-xs pt-2" content={<ChartLegendContent />} />}
                    </PieChart>
                </ChartContainer>
                {isEmpty && (
                    <p className="text-center text-muted-foreground text-xs -mt-2">
                        No hay datos registrados para este período
                    </p>
                )}
            </CardContent>
        </Card>
    );
}