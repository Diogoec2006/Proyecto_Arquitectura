export function SummaryField({ label, value }: {label: string, value: string}) {
    return (
        <div>
            <div className="text-sm text-gray-500 font-semibold uppercase tracking-[0.8px] mb-0.5">
                {label}
            </div>
            <div className="text-lg font-semibold whitespace-pre-line">{value}</div>
        </div>
    );
}