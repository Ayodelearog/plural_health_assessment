"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Clock, TrendingUp, X } from "lucide-react";
import { appointments } from "@/data/data";

interface SearchOverlayProps {
	isOpen: boolean;
	onClose: () => void;
	searchQuery: string;
	onSearchSelect: (query: string) => void;
	inputRef: React.RefObject<HTMLInputElement | null>;
}

export default function SearchOverlay({
	isOpen,
	onClose,
	searchQuery,
	onSearchSelect,
	inputRef,
}: SearchOverlayProps) {
	const overlayRef = useRef<HTMLDivElement>(null);
	const [recentSearches, setRecentSearches] = useState<string[]>([]);
	const [inputRect, setInputRect] = useState<DOMRect | null>(null);

	// Load recent searches from localStorage
	useEffect(() => {
		const saved = localStorage.getItem("recentSearches");
		if (saved) {
			setRecentSearches(JSON.parse(saved));
		}
	}, []);

	// Save search to recent searches
	const saveRecentSearch = (query: string) => {
		if (!query.trim()) return;

		const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(
			0,
			5
		);
		setRecentSearches(updated);
		localStorage.setItem("recentSearches", JSON.stringify(updated));
	};

	// Remove a recent search
	const removeRecentSearch = (query: string) => {
		const updated = recentSearches.filter((s) => s !== query);
		setRecentSearches(updated);
		localStorage.setItem("recentSearches", JSON.stringify(updated));
	};

	// Get input position
	useEffect(() => {
		if (isOpen && inputRef.current) {
			setInputRect(inputRef.current.getBoundingClientRect());
		}
	}, [isOpen, inputRef]);

	// Close on outside click
	useEffect(() => {
		if (!isOpen) return;

		const handleClickOutside = (e: MouseEvent) => {
			if (
				overlayRef.current &&
				!overlayRef.current.contains(e.target as Node) &&
				!inputRef.current?.contains(e.target as Node)
			) {
				onClose();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isOpen, onClose, inputRef]);

	// Get search suggestions based on query
	const getSuggestions = () => {
		if (!searchQuery.trim()) return [];

		const query = searchQuery.toLowerCase();
		const suggestions = new Set<string>();

		appointments.forEach((appointment) => {
			if (appointment.patientName.toLowerCase().includes(query)) {
				suggestions.add(appointment.patientName);
			}
			if (appointment.patientId.toLowerCase().includes(query)) {
				suggestions.add(appointment.patientId);
			}
			if (appointment.clinic.toLowerCase().includes(query)) {
				suggestions.add(appointment.clinic);
			}
		});

		return Array.from(suggestions).slice(0, 5);
	};

	const suggestions = getSuggestions();

	// Get popular searches (most common clinics/statuses)
	const popularSearches = [
		"Neurology",
		"Cardiology",
		"Processing",
		"Awaiting doctor",
	];

	if (!isOpen) return null;

	return (
		<div
			ref={overlayRef}
			className="fixed bg-white rounded-[16px] shadow-2xl border border-gray-200 z-50 animate-fadeIn overflow-hidden"
			style={{
				top: inputRect ? `${inputRect.bottom + 8}px` : "0px",
				left: inputRect ? `${inputRect.left}px` : "0px",
				width: inputRect ? `${inputRect.width}px` : "600px",
				maxHeight: "400px",
			}}>
			<div className="overflow-y-auto max-h-[400px]">
				{/* Search Suggestions */}
				{suggestions.length > 0 && (
					<div className="p-4 border-b border-gray-100">
						<div className="flex items-center gap-2 mb-3">
							<Search className="w-4 h-4 text-gray-400" />
							<h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
								Suggestions
							</h3>
						</div>
						<div className="flex flex-col gap-1">
							{suggestions.map((suggestion, index) => (
								<button
									key={index}
									onClick={() => {
										onSearchSelect(suggestion);
										saveRecentSearch(suggestion);
										onClose();
									}}
									className="text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-base text-gray-700 hover:text-primary">
									<HighlightedText text={suggestion} query={searchQuery} />
								</button>
							))}
						</div>
					</div>
				)}

				{/* Recent Searches */}
				{!searchQuery && recentSearches.length > 0 && (
					<div className="p-4 border-b border-gray-100">
						<div className="flex items-center gap-2 mb-3">
							<Clock className="w-4 h-4 text-gray-400" />
							<h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
								Recent Searches
							</h3>
						</div>
						<div className="flex flex-col gap-1">
							{recentSearches.map((search, index) => (
								<div
									key={index}
									className="flex items-center justify-between group">
									<button
										onClick={() => {
											onSearchSelect(search);
											onClose();
										}}
										className="flex-1 text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-base text-gray-700 hover:text-primary">
										{search}
									</button>
									<button
										onClick={() => removeRecentSearch(search)}
										className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-all">
										<X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
									</button>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Popular Searches */}
				{!searchQuery && (
					<div className="p-4">
						<div className="flex items-center gap-2 mb-3">
							<TrendingUp className="w-4 h-4 text-gray-400" />
							<h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
								Popular Searches
							</h3>
						</div>
						<div className="flex flex-wrap gap-2">
							{popularSearches.map((search, index) => (
								<button
									key={index}
									onClick={() => {
										onSearchSelect(search);
										saveRecentSearch(search);
										onClose();
									}}
									className="px-3 py-1.5 bg-gray-50 hover:bg-primary/10 hover:text-primary rounded-full text-sm text-gray-700 transition-colors border border-gray-200 hover:border-primary/30">
									{search}
								</button>
							))}
						</div>
					</div>
				)}

				{/* No results message */}
				{searchQuery && suggestions.length === 0 && (
					<div className="p-8 text-center">
						<div className="text-4xl opacity-20 mb-2">🔍</div>
						<p className="text-sm text-gray-500">
							No suggestions for "{searchQuery}"
						</p>
						<p className="text-xs text-gray-400 mt-1">
							Press Enter to search anyway
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

// Helper component to highlight matching text
function HighlightedText({ text, query }: { text: string; query: string }) {
	if (!query.trim()) return <span>{text}</span>;

	const parts = text.split(new RegExp(`(${query})`, "gi"));

	return (
		<span>
			{parts.map((part, index) =>
				part.toLowerCase() === query.toLowerCase() ? (
					<span
						key={index}
						className="font-semibold text-primary bg-primary/10">
						{part}
					</span>
				) : (
					<span key={index}>{part}</span>
				)
			)}
		</span>
	);
}
