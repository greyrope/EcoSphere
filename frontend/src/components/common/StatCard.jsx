export default function StatCard({
  title,
  value,
  maxValue = 100,
  change = 0,
  accentColor = "bg-emerald-500",
  subtitle,
  comparisonText = "vs. last month",
  icon,
}) {
  const isPositive = change >= 0;

  const changeLabel = `${isPositive ? "+" : "-"}${Math.abs(change)}%`;

  const changeColor = isPositive
    ? "text-emerald-600"
    : "text-rose-600";

  return (
    <article className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      {/* Top Accent Bar */}
      <div className={`h-1.5 w-full rounded-full ${accentColor}`} />

      {/* Header */}
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-gray-700">
            {title}
          </h3>

          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">
              {subtitle}
            </p>
          )}
        </div>

        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
            {icon}
          </div>
        )}
      </div>

      {/* Score */}
      <div className="mt-6 flex items-end gap-2">
        <span className="text-3xl font-bold tracking-tight text-gray-900">
          {value}
        </span>

        <span className="pb-1 text-sm font-medium text-gray-500">
          /{maxValue}
        </span>
      </div>

      {/* Change Indicator */}
      <div className="mt-4 flex items-center gap-2">
        <span
          className={`rounded-full px-2 py-1 text-xs font-semibold ${isPositive
              ? "bg-emerald-100 text-emerald-700"
              : "bg-rose-100 text-rose-700"
            }`}
        >
          {changeLabel}
        </span>

        <span className="text-xs text-gray-500">
          {comparisonText}
        </span>
      </div>
    </article>
  );
}