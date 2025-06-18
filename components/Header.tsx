"use client"

import Link from "next/link"
import ButtonSignin from "./ButtonSignin"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import config from "@/config"
import logo from "@/app/icon.png"

export function Header() {
  // Responsive header: track if mobile menu is open and window width for responsiveness
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Function to check if screen is mobile
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false); // Close mobile menu on desktop
      }
    };

    // Function to handle clicks outside the mobile menu
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    handleResize(); // Set initial value

    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen((open) => !open);

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Logo and app name */}        
        <Link href="/" className="flex items-center gap-2 z-10">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full border-2 border-white"></div>
          </div>
          <span className="font-bold text-xl text-gray-900 ">Dispo Depot</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4 ml-auto">
          <ButtonSignin extraStyle="bg-green-500 text-white px-4 py-2 rounded-full font-medium hover:bg-green-600 transition-colors font-normal" text="sign up" />
        </div>

        {/* Mobile menu button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 ml-auto"
          aria-label="Toggle menu"
        >
          <div className="w-6 h-6 flex flex-col justify-center items-center gap-1.5">
            <span className={`block w-6 h-0.5 bg-gray-600 transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-600 transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-600 transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </div>
        </button>

        {/* Mobile Navigation Menu */}
        <div 
          ref={mobileMenuRef}
          className={`fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}
        >
          {/* X Close Button */}
          <button
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 focus:outline-none"
            aria-label="Close menu"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-gray-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex flex-col items-center justify-center h-full gap-8">
            <ButtonSignin 
              extraStyle="bg-green-500 text-white px-6 py-3 rounded-full font-medium hover:bg-green-600 transition-colors text-lg" 
              text="sign up"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
