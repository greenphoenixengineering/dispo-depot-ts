import Link from "next/link"
import ButtonSignin from "./ButtonSignin"

export function Header() {
  return (
    <header className="border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full border-2 border-white"></div>
          </div>
          <span className="font-bold text-xl">Dispo Depot</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-gray-700 hover:text-gray-900 font-medium">
            Pricing
          </Link>
      
          <ButtonSignin  extraStyle="bg-green-500 text-white px-4 py-2 rounded-full font-medium hover:bg-green-600 transition-colors" text="sign up"/>
        </div>
      </div>
    </header>
  )
}
