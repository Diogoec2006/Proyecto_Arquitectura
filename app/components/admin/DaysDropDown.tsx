"use client";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface DaysDropDownProps {
    setDays: (days: number) => void;
    days: number;
    setCustomFromTo: (input: { from: string, to: string } | null) => void;
}

const options = [
    { days: 7, label: "Últimos 7 días" },
    { days: 30, label: "Últimos 30 días" },
    { days: 90, label: "Últimos 90 días" },
    { days: 365, label: "Último año" }
];

export default function DaysDropDown({ setDays, days, setCustomFromTo }: DaysDropDownProps) {
    const [showCustom, setShowCustom] = useState(false);
    const [customDateFrom, setCustomDateFrom] = useState("");
    const [customDateTo, setCustomDateTo] = useState("");

    const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const from = e.target.value;
        setCustomDateFrom(from);
        if (customDateTo) {
            const diff = Math.round((new Date(customDateTo).getTime() - new Date(from).getTime()) / (1000 * 60 * 60 * 24));
            if (diff > 0) {
                setDays(diff);
                setCustomFromTo({ from, to: customDateTo });
            }
        }
    };

    const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const to = e.target.value;
        setCustomDateTo(to);
        if (customDateFrom) {
            const diff = Math.round((new Date(to).getTime() - new Date(customDateFrom).getTime()) / (1000 * 60 * 60 * 24));
            if (diff > 0) {
                setDays(diff);
                setCustomFromTo({ from: customDateFrom, to });
            }
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-2xl border border-gray-200 shadow-xs">
            <Select
                defaultValue={days.toString()}
                onValueChange={(value) => {
                    if (value === "custom") {
                        setShowCustom(true);
                    } else {
                        setShowCustom(false);
                        setCustomFromTo(null);
                        setCustomDateFrom("");
                        setCustomDateTo("");
                        setDays(Number(value));
                    }
                }}
            >
                <SelectTrigger className="text-xs font-bold border-gray-300 rounded-xl">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                    <SelectGroup>
                        {options.map(option => (
                            <SelectItem key={option.days} value={option.days.toString()} className="text-xs font-semibold">
                                {option.label}
                            </SelectItem>
                        ))}
                        <SelectItem value="custom" className="text-xs font-semibold">Rango personalizado...</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>

            {showCustom && (
                <div className="flex flex-wrap items-center gap-3 text-xs">
                    <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-gray-500">Desde:</span>
                        <input
                            type="date"
                            value={customDateFrom}
                            max={customDateTo || new Date().toISOString().split("T")[0]}
                            onChange={handleFromChange}
                            className="border border-gray-300 rounded-lg px-2 py-1 text-xs"
                        />
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-gray-500">Hasta:</span>
                        <input
                            type="date"
                            value={customDateTo}
                            min={customDateFrom}
                            max={new Date().toISOString().split("T")[0]}
                            onChange={handleToChange}
                            className="border border-gray-300 rounded-lg px-2 py-1 text-xs"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}