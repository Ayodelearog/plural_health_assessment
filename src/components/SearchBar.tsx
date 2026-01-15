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
					{/* <Fingerprint className="w-4 h-4 text-gray-400" /> */}
					<svg
						width="16"
						height="16"
						viewBox="0 0 16 16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<path
							d="M13.4266 3.74689C14.1439 4.94638 14.4504 6.35 14.299 7.74205V8.54108C14.298 9.38236 14.5169 10.2091 14.9334 10.9382M4.78204 6.94301C4.78204 6.09535 5.11626 5.2824 5.71119 4.68301C6.30611 4.08362 7.113 3.74689 7.95435 3.74689C8.7957 3.74689 9.60259 4.08362 10.1975 4.68301C10.7924 5.2824 11.1267 6.09535 11.1267 6.94301V7.74205C11.1267 9.47091 11.6832 11.1531 12.7128 12.5362M7.95434 6.94301V8.54108C7.95181 10.8258 8.64373 13.0566 9.93704 14.9333M4.78204 10.1391C4.97611 11.809 5.45927 13.4316 6.20958 14.9333M2.3235 13.3353C1.78837 11.5217 1.54734 9.63301 1.60973 7.74205V6.94302C1.60669 5.81947 1.89763 4.71496 2.45325 3.74078C3.00887 2.76661 3.80952 1.95719 4.77454 1.39409C5.73955 0.830987 6.83484 0.534097 7.95002 0.533334C9.0652 0.532572 10.1609 0.827965 11.1267 1.38975"
							stroke="#A6AFC2"
							strokeLinecap="square"
							strokeLinejoin="round"
						/>
					</svg>
				</button>
				<button className="hover:bg-gray-100 rounded-lg transition-colors absolute right-3 top-1/2 transform -translate-y-1/2">
					{/* <SlidersHorizontal className="w-4 h-4 text-gray-400" /> */}
					<svg
						width="16"
						height="16"
						viewBox="0 0 16 16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<path
							d="M0 2.66666H16M3.2 8H12.8M5.33333 13.3333H10.6667"
							stroke="#A6AFC2"
							strokeWidth="1.06667"
						/>
					</svg>
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
