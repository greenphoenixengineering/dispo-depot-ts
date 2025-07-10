/* eslint-disable @next/next/no-img-element */
"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import config from "@/config";
import { Popover, Transition } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { User, LogOut } from "lucide-react";

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
      <div className="relative">
        <Popover className="relative z-10">
          {({ open }: { open: boolean }) => {
            return (
              <>
                <Popover.Button className={`btn flex items-center justify-center gap-2 px-3 py-1 md:px-4 md:py-2 text-sm md:text-base leading-none text-gray-800 ${extraStyle ? extraStyle : ""}`} style={{ height: 'auto' }}>
                  {session.user?.image ? (
                    <img
                      src={session.user?.image}
                      alt={session.user?.name || "Account"}
                      className="w-6 h-6 sm:w-7 sm:h-7 md:w-6 md:h-6 rounded-full shrink-0 object-cover"
                      referrerPolicy="no-referrer"
                      width={24}
                      height={24}
                    />
                  ) : (
                    <span className="w-5 h-6 sm:w-7 sm:h-7 md:w-6 md:h-6 bg-base-300 flex items-center justify-center rounded-full shrink-0 text-sm sm:text-base md:text-sm font-semibold text-gray-800">
                      {session.user?.name?.charAt(0) || session.user?.email?.charAt(0)}
                    </span>
                  )}
                  <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 duration-200 ${open ? "transform rotate-180 " : ""} text-gray-800 max-[375px]:hidden`} />
                </Popover.Button>
                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Popover.Panel className="absolute right-0 z-10 mt-3 w-56 origin-top-right rounded-xl shadow-xl ring-1 ring-base-content ring-opacity-5 bg-base-100 p-1">
                    <div className="space-y-0.5 text-sm">
                      <Link href="/dashboard/tags" className="flex items-center gap-2 hover:bg-base-300 duration-200 py-1.5 px-4 w-full rounded-lg font-medium">
                        <span className="w-5 h-5 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" /></svg></span>
                        Dashboard
                      </Link>
                      <Link href="/account" className="flex items-center gap-2 hover:bg-base-300 duration-200 py-1.5 px-4 w-full rounded-lg font-medium">
                        <User className="w-5 h-5" />
                        Manage Account
                      </Link>
                      <button
                        className="flex items-center gap-2 hover:bg-base-300 duration-200 py-1.5 px-4 w-full rounded-lg font-medium text-red-600"
                        onClick={() => signOut({ callbackUrl: "/" })}
                      >
                        <LogOut className="w-5 h-5" />
                        Logout
                      </button>
                    </div>
                  </Popover.Panel>
                </Transition>
              </>
            );
          }}
        </Popover>
      </div>
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
