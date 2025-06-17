import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 bg-green-500 text-white rounded-md px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "Sending..." : "Send Deal"}
    </button>
  );
}