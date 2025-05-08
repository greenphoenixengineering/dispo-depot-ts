interface TagChipProps {
  label: string
  index: number;

}

export function TagChip({ label, index }: TagChipProps) {
  const colorClasses = {
    green: "bg-green-100 text-green-800",
    blue: "bg-blue-100 text-blue-800",
    purple: "bg-purple-100 text-purple-800",
    yellow: "bg-yellow-100 text-yellow-800",
    red: "bg-red-100 text-red-800",
  } as const;

  const colorKeys = Object.keys(colorClasses) as (keyof typeof colorClasses)[];
  const selectedColor = colorKeys[index % colorKeys.length];
  const colorClass = colorClasses[selectedColor];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {label}
    </span>
  );
}
