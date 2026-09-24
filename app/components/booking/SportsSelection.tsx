export default function SportsSelection({sports, selectedSport, setSelectedSport}: {sports: string[], selectedSport: string, setSelectedSport: (sport: string) => void}) {

    const formatSportName = (sport: string) => {
        const s = String(sport).toLowerCase();
        if (s === "futbol5") return "Fútbol 5";
        if (s === "futbol7") return "Fútbol 7";
        if (s === "futbol11") return "Fútbol 11";
        return s.charAt(0).toUpperCase() + s.slice(1);
    };

    const formattedSports: { sportKey: string; sportName: string; sportSvg: string }[] = sports.map(sport => ({
        sportKey: sport,
        sportName: formatSportName(sport),
        sportSvg: `/${sport.toLowerCase()}.svg`
    }));
    
    return (
        <div className="flex flex-wrap gap-3 pb-6 pt-2">
            {formattedSports.map(sport => (
                <button
                    key={sport.sportKey}
                    onClick={() => setSelectedSport(sport.sportKey)}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                        selectedSport.toLowerCase() === sport.sportKey.toLowerCase()
                            ? "bg-emerald-600 text-white shadow-emerald-600/30"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={sport.sportSvg} alt="" width={22} height={22} onError={(e) => e.currentTarget.style.display = "none"} className={selectedSport.toLowerCase() === sport.sportKey.toLowerCase() ? "" : "invert opacity-40"} /> {sport.sportName}
                </button>
            ))}
        </div>
    );
}