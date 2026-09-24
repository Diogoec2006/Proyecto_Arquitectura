interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  green?: boolean;
}

export default function StatCard({ label, value, sub, green }: StatCardProps) {
  return (
    <div className="bg-gray-50 border-2 border-gray-100 rounded-2xl px-10 py-6 min-w-64">
      <p className="text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-2">
        {label}
      </p>
      <p
        className={`text-4xl font-bold tracking-tight leading-none ${
          green ? "text-green-500" : "text-gray-900"
        }`}
      >
        {value}
      </p>
      <p className="text-sm text-gray-400 mt-1">{sub}</p>
    </div>
  );
}