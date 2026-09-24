type DateTabType = "today" | "tomorrow" | "pick";

interface DateTabProps {
  type: DateTabType;
  active: boolean;
  onClick: () => void;
  pickedDate?: string;
  onPickedDate?: (val: string) => void;
}

const MONTH_NAMES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export default function DateTab({ type, active, onClick, pickedDate, onPickedDate }: DateTabProps) {
    const today = new Date();

    const getLabel = () => {
        if (type === "today") {
            return `Hoy — ${today.getDate()} ${MONTH_NAMES[today.getMonth()]}`;
        }
        if (type === "tomorrow") {
            const t = new Date(today);
            t.setDate(t.getDate() + 1);
            return `Mañana — ${t.getDate()} ${MONTH_NAMES[t.getMonth()]}`;
        }
        
        return "Elegir fecha";
    };

    return (
        <div className="flex items-center gap-2">
            <button onClick={onClick} className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${active ? "bg-emerald-600 text-white shadow-xs": "bg-white border border-gray-200 text-gray-700 hover:border-emerald-400"}`}>
                {getLabel()}
            </button>
            {type === "pick" && active && (
                <input
                    type="date"
                    value={pickedDate}
                    onChange={(e) => onPickedDate?.(e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
            )}
        </div>
    );
}