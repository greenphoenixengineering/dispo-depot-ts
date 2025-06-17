import { useFormStatus } from "react-dom";

export function SubmitButton({email_authorized}:{email_authorized:boolean}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || !email_authorized}
      className="inline-flex items-center gap-2 bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "Sending..." : "Send Deal"}
    </button>
  );
}