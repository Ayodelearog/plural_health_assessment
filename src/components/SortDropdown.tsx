"use client";

import { useEffect, useRef } from "react";

interface SortDropdownProps {
	isOpen: boolean;
	onClose: () => void;
	selectedSort: string;
	onSelectSort: (sort: string) => void;
	buttonRef: React.RefObject<HTMLButtonElement | null>;
}

const sortOptions = [
	{
		id: "patient-name-asc",
		label: "Patient name: A-Z",
		category: "Patient name",
	},
	{
		id: "patient-name-desc",
		label: "Patient name: Z-A",
		category: "Patient name",
	},
	{
		id: "patient-id-asc",
		label: "Patient ID: Ascending",
		category: "Patient ID",
	},
	{
		id: "patient-id-desc",
		label: "Patient ID: Descending",
		category: "Patient ID",
	},
	{ id: "gender-male", label: "Gender: Male", category: "Gender" },
	{ id: "gender-female", label: "Gender: Female", category: "Gender" },
];

export default function SortDropdown({
	isOpen,
	onClose,
	selectedSort,
	onSelectSort,
	buttonRef,
}: SortDropdownProps) {
	const overlayRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!isOpen) return;

		const handleClickOutside = (event: MouseEvent) => {
			if (
				overlayRef.current &&
				!overlayRef.current.contains(event.target as Node) &&
				buttonRef.current &&
				!buttonRef.current.contains(event.target as Node)
			) {
				onClose();
			}
		};

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keydown", handleEscape);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleEscape);
		};
	}, [isOpen, onClose, buttonRef]);

	if (!isOpen) return null;

	const buttonRect = buttonRef.current?.getBoundingClientRect();

	// Group options by category
	const categories = sortOptions.reduce((acc, option) => {
		if (!acc[option.category]) {
			acc[option.category] = [];
		}
		acc[option.category].push(option);
		return acc;
	}, {} as Record<string, typeof sortOptions>);

	return (
		<div
			ref={overlayRef}
			className="fixed bg-white rounded-[16px] shadow-lg border border-gray-200 py-4 px-6 z-50 animate-fadeIn"
			style={{
				top: buttonRect ? `${buttonRect.bottom + 8}px` : "0px",
				left: buttonRect ? `${buttonRect.left}px` : "0px",
				minWidth: "320px",
			}}>
			<div className="flex flex-col gap-4">
				{Object.entries(categories).map(([category, options], index) => (
					<div key={category}>
						{/* {index > 0 && (
							<div className="border-t border-gray-200 -mx-6 mb-4"></div>
						)} */}
						<div className="flex items-center gap-2">
							<p className="text-sm font-bold text-[#A6AFC2]  uppercase tracking-wide whitespace-nowrap">
								{category}
							</p>
							<span className="border border-[#DFE2E9] w-full"></span>
						</div>

						<div className="flex flex-col gap-3">
							{options.map((option) => (
								<button
									key={option.id}
									onClick={() => {
										onSelectSort(option.id);
										onClose();
									}}
									className={`text-left text-lg font-medium transition-colors hover:text-primary ${
										selectedSort === option.id
											? "text-primary font-bold"
											: "text-[#051438]"
									}`}>
									{option.label}
								</button>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
