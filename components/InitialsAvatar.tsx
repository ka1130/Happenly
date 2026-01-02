export default function InitialsAvatar({
  name,
  className,
  fontSize,
}: {
  name: string;
  className?: string;
  fontSize?: string;
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const bgColor = "#0D8ABC";
  return (
    <div
      className={`flex items-center justify-center rounded-full text-white ${className} `}
      style={{ backgroundColor: bgColor }}
    >
      <span style={{ fontSize }}>{initials || "U"}</span>
    </div>
  );
}
