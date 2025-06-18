/* eslint-disable @next/next/no-img-element */
"use client";

import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import config from "@/config";

// A simple button to sign in with our providers (Google & Magic Links).
// It automatically redirects user to callbackUrl (config.auth.callbackUrl) after login, which is normally a private page for users to manage their accounts.
// If the user is already logged in, it will show their profile picture & redirect them to callbackUrl immediately.
const ButtonSignin = ({
  text = "Get started",
  extraStyle,
}: {
  text?: string;
  extraStyle?: string;
}) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleClick = () => {
    if (status === "authenticated") {
      router.push(config.auth.callbackUrl);
    } else {
      signIn(undefined, { callbackUrl: config.auth.callbackUrl });
    }
  };

  if (status === "authenticated") {
    return (
      <Link
        href={config.auth.callbackUrl}
        className={`btn flex items-center justify-center gap-2 px-3 py-1 md:px-4 md:py-2 text-sm md:text-base leading-none ${extraStyle ? extraStyle : ""}`}
        style={{ height: 'auto' }}
      >
        {session.user?.image ? (
          <img
            src={session.user?.image}
            alt={session.user?.name || "Account"}
            className="w-7 h-7 md:w-6 md:h-6 rounded-full shrink-0 object-cover"
            referrerPolicy="no-referrer"
            width={24}
            height={24}
          />
        ) : (
          <span className="w-7 h-7 md:w-6 md:h-6 bg-base-300 flex items-center justify-center rounded-full shrink-0 text-base md:text-sm font-semibold">
            {session.user?.name?.charAt(0) || session.user?.email?.charAt(0)}
          </span>
        )}
        <span className="font-semibold flex items-center">{session.user?.name || (session.user?.email ? session.user.email.split("@")[0] : "Account")}</span>
      </Link>
    );
  }

  return (
    <button
      className={`btn ${extraStyle ? extraStyle : ""}`}
      onClick={handleClick}
    >
      {text}
    </button>
  );
};

export default ButtonSignin;
