"use client";

import { Search, Fingerprint, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SearchOverlay from "./SearchOverlay";

interface SearchBarProps {
	searchQuery: string;
	onSearchChange: (query: string) => void;
	onSearchFocus?: () => void;
	onSearchBlur?: () => void;
}

export default function SearchBar({
	searchQuery,
	onSearchChange,
	onSearchFocus,
	onSearchBlur,
}: SearchBarProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [isOverlayOpen, setIsOverlayOpen] = useState(false);

	// Handle Escape key to clear search
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && searchQuery) {
				onSearchChange("");
				inputRef.current?.blur();
				setIsOverlayOpen(false);
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [searchQuery, onSearchChange]);

	const handleClear = () => {
		onSearchChange("");
		inputRef.current?.focus();
	};

	const handleFocus = () => {
		setIsOverlayOpen(true);
		onSearchFocus?.();
	};

	const handleSearchSelect = (query: string) => {
		onSearchChange(query);
	};

	return (
		<div className="w-full flex justify-center">
			<div className="relative flex w-[600px] bg-[#FFFFFF] px-3 py-2.5 border rounded-[10px] border-[#DFE2E9] transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
				<input
					ref={inputRef}
					type="text"
					placeholder="Find patient"
					value={searchQuery}
					onChange={(e) => onSearchChange(e.target.value)}
					onFocus={handleFocus}
					onBlur={onSearchBlur}
					className="w-full pl-6 pr-20 focus:outline-none active:outline-none outline-none placeholder:font-medium placeholder:text-base placeholder:text-[#A6AFC2]"
				/>

				{/* Clear button - only show when there's text */}
				{searchQuery && (
					<button
						onClick={handleClear}
						className="hover:bg-gray-100 rounded-lg transition-colors absolute right-[72px] top-1/2 transform -translate-y-1/2 p-1"
						title="Clear search (Esc)">
						<X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
					</button>
				)}

				<button className="hover:bg-gray-100 rounded-lg transition-colors absolute right-10 top-1/2 transform -translate-y-1/2">
					<Fingerprint className="w-4 h-4 text-gray-400" />
				</button>
				<button className="hover:bg-gray-100 rounded-lg transition-colors absolute right-3 top-1/2 transform -translate-y-1/2">
					<SlidersHorizontal className="w-4 h-4 text-gray-400" />
				</button>
			</div>

			{/* Search Overlay */}
			<SearchOverlay
				isOpen={isOverlayOpen}
				onClose={() => setIsOverlayOpen(false)}
				searchQuery={searchQuery}
				onSearchSelect={handleSearchSelect}
				inputRef={inputRef}
			/>
		</div>
	);
}
