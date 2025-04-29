// src/components/SearchableSelect.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronDown, X } from 'lucide-react'; // Or your preferred icons

interface SearchableSelectProps {
    options: string[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    noResultsText?: string;
    allowClear?: boolean; 
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
    options,
    value,
    onChange,
    placeholder = "Select...",
    noResultsText = "No results found",
    allowClear = true, 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Add "No Tag" option if required
    const effectiveOptions = options;

    const filteredOptions = effectiveOptions.filter((option) =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (option: string) => {
        const newValue = option;
        onChange(newValue);
        setSearchTerm(""); 
        setIsOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent opening the dropdown
        onChange("");
        setSearchTerm("");
    }

    // Click outside handler
    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            setIsOpen(false);
            setSearchTerm(""); // Clear search on close
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            // Focus input when dropdown opens
            inputRef.current?.focus();
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        // Cleanup listener on unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, handleClickOutside]);


    return (
        <div className="relative w-full" ref={containerRef}>
            {/* Trigger Button */}
            <button
                type="button" // Important for forms
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md text-left bg-white
                            focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                            flex justify-between items-center ${!value ? 'text-gray-500' : 'text-gray-900'}`} // Style placeholder text
            >
                <span>{value || placeholder}</span> {/* Display selected value or placeholder */}
                <div className="flex items-center">
                     {/* Clear Button */}
                    {allowClear && value && (
                        <X
                           size={16}
                           className="text-gray-400 hover:text-gray-600 mr-1 cursor-pointer"
                           onClick={handleClear}
                           aria-label="Clear selection"
                       />
                    )}
                    <ChevronDown
                        size={16}
                        className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </div>
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {/* Search Input */}
                    <div className="p-2 sticky top-0 bg-white border-b border-gray-200">
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search..."
                            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                    </div>

                    {/* Options List */}
                    <ul>
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <li
                                    key={option}
                                    onClick={() => handleSelect(option)}
                                    className={`px-3 py-2 cursor-pointer hover:bg-green-50 ${
                                        (option === value || (value === '')) ? 'bg-green-100 font-medium' : ''
                                    }`} 
                                >
                                    {option}
                                </li>
                            ))
                        ) : (
                            <li className="px-3 py-2 text-gray-500">{noResultsText}</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};