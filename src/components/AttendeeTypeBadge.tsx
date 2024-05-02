const colors: Record<string, string> = {
  Founder: "bg-blue-200",
  Investor: "bg-green-200",
  Engineer: "bg-purple-200",
  "Product Manager": "bg-yellow-200",
  Designer: "bg-pink-200",
  Other: "bg-gray-200",
};

export default function AttendeeTypeBadge({ type }: { type: string | null }) {
  if (!type) return null;
  const color = colors[type] ?? "bg-gray-200";
  return (
    <span
      className={`rounded-lg px-2 text-xs font-semibold ${color} text-${color.replace("bg-", "")}-800`}
    >
      {type}
    </span>
  );
}
