import Link from "next/link";

export default function UserFooter() {
  return (
    <div className="mt-auto flex items-center justify-between border-t border-gray-200 p-4 md:pr-0">
      {/* Left: avatar + text */}
      <div className="flex items-center space-x-3">
        {/* Avatar container */}
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
          <img
            src="https://aeb64540-f3fa-4b3d-83da-19f135f24963-00-n847jmzuxjv1.riker.replit.dev/@fs/home/runner/workspace/attached_assets/stock_images/professional_headsho_8a7e57ae.jpg"
            alt="User Avatar"
            className="h-full w-full object-cover"
          />
        </div>
        {/* Name + email */}
        <div className="flex flex-col">
          <span className="font-medium">Jane Doe</span>
          <span className="text-sm text-gray-500">j.doe@example.com</span>
        </div>
      </div>

      {/* Right: settings link */}
      <Link
        href="/settings"
        className="flex items-center rounded-full p-2 hover:bg-gray-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </Link>
    </div>
  );
}
