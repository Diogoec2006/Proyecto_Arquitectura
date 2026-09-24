import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function SportsDropdown({ sports, selectedSport, setSelectedSport }: {sports: string[], selectedSport: string, setSelectedSport: (sport: string) => void}) {
    
    const formatSport = (s: string) => {
        const lower = s.toLowerCase();
        if (lower === "futbol5") return "Fútbol 5";
        if (lower === "futbol7") return "Fútbol 7";
        if (lower === "futbol11") return "Fútbol 11";
        return s.charAt(0).toUpperCase() + s.slice(1);
    };

    const sportsList = sports.length ? sports : ["futbol5"];

    return (
        <div className="flex items-center gap-2">
            <Select
                defaultValue={selectedSport.toString()}
                onValueChange={(value) => setSelectedSport(value)}
            >
                <SelectTrigger className="text-gray-700 font-bold border-gray-300 border px-4 py-2 rounded-full h-auto text-xs bg-white">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                    <SelectGroup>
                        {sportsList.map(sport => (
                            <SelectItem key={sport} value={sport.toString()} className="text-xs font-semibold">
                                {formatSport(sport)}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}
