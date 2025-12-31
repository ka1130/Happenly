import { useRouter } from "next/navigation";

type SignInProps = { redirectTo?: string };

export default function SignInPrompt({ redirectTo }: SignInProps) {
  const router = useRouter();
  return (
    <div className="py-10 text-center text-stone-600">
      <h3 className="mb-2 text-xl font-semibold">Sign in required</h3>
      <p className="mb-6">You must be logged in to create an event.</p>
      <button
        onClick={() =>
          router.push(
            `/auth?mode=signIn&redirect=${encodeURIComponent(redirectTo ?? "/")}`,
          )
        }
        className="cursor-pointer rounded-md bg-blue-500 px-4 py-1.5 text-white"
      >
        Sign in
      </button>
    </div>
  );
}
