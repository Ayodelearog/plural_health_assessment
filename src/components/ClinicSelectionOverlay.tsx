"use client";

import { useEffect, useRef, useState } from "react";

interface ClinicSelectionOverlayProps {
	isOpen: boolean;
	onClose: () => void;
	selectedClinic: string;
	onSelectClinic: (clinic: string) => void;
	buttonRef: React.RefObject<HTMLButtonElement | null>;
}

const clinics = [
	"Accident and Emergency",
	"Neurology",
	"Cardiology",
	"Gastroenterology",
	"Renal",
];

export default function ClinicSelectionOverlay({
	isOpen,
	onClose,
	selectedClinic,
	onSelectClinic,
	buttonRef,
}: ClinicSelectionOverlayProps) {
	const overlayRef = useRef<HTMLDivElement>(null);
	const [searchQuery, setSearchQuery] = useState("");

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

	const filteredClinics = clinics.filter((clinic) =>
		clinic.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div
			ref={overlayRef}
			className="fixed bg-[#EDF0F8] rounded-[10px] shadow-2xl border border-[#CDD8F3] p-8 z-[60] animate-fadeIn"
			style={{
				top: buttonRect ? `${buttonRect.bottom + 8}px` : "0px",
				left: buttonRect ? `${buttonRect.left}px` : "0px",
				minWidth: "500px",
				maxHeight: "600px",
			}}>
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<h3 className="text-[22px] font-bold text-[#051438]">Clinic</h3>
				<button
					onClick={onClose}
					className="p-2 hover:bg-gray-100 bg-[#DFE2E9] rounded-full transition-colors">
					<svg
						width="16"
						height="16"
						viewBox="0 0 16 16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M7.24578 8.00004L1.57645 2.33072C1.38119 2.13545 1.38119 1.81887 1.57645 1.62361L1.62359 1.57647C1.81886 1.38121 2.13544 1.38121 2.3307 1.57647L8.00002 7.24579L13.6693 1.57647C13.8646 1.38121 14.1812 1.38121 14.3765 1.57647L14.4236 1.62361C14.6189 1.81887 14.6189 2.13545 14.4236 2.33072L8.75427 8.00004L14.4236 13.6694C14.6189 13.8646 14.6189 14.1812 14.4236 14.3765L14.3765 14.4236C14.1812 14.6189 13.8646 14.6189 13.6693 14.4236L8.00002 8.75429L2.3307 14.4236C2.13544 14.6189 1.81886 14.6189 1.62359 14.4236L1.57645 14.3765C1.38119 14.1812 1.38119 13.8646 1.57645 13.6694L7.24578 8.00004Z"
							fill="#0B0C7D"
						/>
					</svg>
				</button>
			</div>

			{/* Search Input */}
			<div className="mb-6">
				<div className="relative">
					<input
						type="text"
						placeholder="Search clinic"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full px-4 py-3 bg-white border border-[#CDD8F3] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-[#A6AFC2] text-base"
					/>
					<svg
						className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#A6AFC2]"
						width="20"
						height="20"
						viewBox="0 0 20 20"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<path
							d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM18 18l-4-4"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</div>
			</div>

			{/* Clinic List */}
			<div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto">
				{filteredClinics.map((clinic) => (
					<button
						key={clinic}
						onClick={() => {
							onSelectClinic(clinic);
							onClose();
						}}
						className={`text-left text-lg font-semibold py-2 transition-colors hover:text-primary ${
							selectedClinic === clinic ? "text-primary" : "text-[#051438]"
						}`}>
						{clinic}
					</button>
				))}
			</div>
		</div>
	);
}

