export default function StatCard({ title, value, icon: Icon, colorClass }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex items-center">
      <div className={`p-4 rounded-xl mr-4 flex-shrink-0 ${colorClass}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      </div>
    </div>
  );
}
