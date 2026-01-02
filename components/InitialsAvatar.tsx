export default function InitialsAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const bgColor = "#0D8ABC";
  return (
    <div
      className="flex h-10 w-10 items-center justify-center rounded-full text-white"
      style={{ backgroundColor: bgColor }}
    >
      {initials || "U"}
    </div>
  );
}
