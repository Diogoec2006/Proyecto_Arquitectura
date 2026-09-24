interface StatusButtonProps {
  onClick: () => void;
  disabled: boolean;
  variant: "completed" | "no_show" | "confirmed";
}

export default function StatusButton({ onClick, disabled, variant }: StatusButtonProps) {
    const styles = {
        confirmed: "text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200",
        completed: "text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200",
        no_show: "text-red-700 bg-red-50 hover:bg-red-100 border border-red-200",
    };

    const labels = {
        confirmed: "Marcar Confirmada",
        completed: "Marcar Completada",
        no_show: "Marcar No Asistió",
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`text-left px-3 py-2 rounded-xl text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer ${styles[variant]}`}
        >
            {labels[variant]}
        </button>
    );
}