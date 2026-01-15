"use client";

import { useEffect, useRef } from "react";

interface AppointmentTypeOverlayProps {
	isOpen: boolean;
	onClose: () => void;
	selectedType: string;
	onSelectType: (type: string) => void;
	buttonRef: React.RefObject<HTMLButtonElement | null>;
}

const appointmentTypes = [
	{
		category: "New (Walk-in, Referral, Consult)",
		types: ["Walk-in", "Referral", "Consult"],
	},
	{
		category: "Follow-up",
		types: [],
	},
	{
		category: "For Medical Exam",
		types: [],
	},
];

export default function AppointmentTypeOverlay({
	isOpen,
	onClose,
	selectedType,
	onSelectType,
	buttonRef,
}: AppointmentTypeOverlayProps) {
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

	return (
		<div
			ref={overlayRef}
			className="fixed bg-[#EDF0F8] rounded-[10px] shadow-2xl border border-[#CDD8F3] p-8 z-[60] animate-fadeIn"
			style={{
				top: buttonRect ? `${buttonRect.bottom + 8}px` : "0px",
				left: buttonRect ? `${buttonRect.left - 350}px` : "0px",
				minWidth: "500px",
			}}>
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<h3 className="text-[22px] font-bold text-[#051438]">
					Appointment type
				</h3>
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

			{/* Appointment Types List */}
			<div className="flex flex-col gap-6">
				{appointmentTypes.map((group) => (
					<div key={group.category}>
						{/* Category Header */}
						{group.category === "New (Walk-in, Referral, Consult)" && (
						<div className="mb-3">
							<h4 className="text-base font-medium text-[#051438]">
								{group.category}
							</h4>
						</div>
						)}

						{/* Sub-types or Single Option */}
						{group.types.length > 0 ? (
							<div className="flex flex-col gap-3 pl-4">
								{group.types.map((type) => (
									<button
										key={type}
										onClick={() => {
											onSelectType(type);
											onClose();
										}}
										className={`text-left text-base font-medium py-2 px-4 rounded-lg transition-all ${
											selectedType === type
												? "bg-[#C8D4F5] text-primary"
												: "text-[#677597] hover:bg-[#DFE2E9]"
										}`}>
										{type}
										{selectedType === type && (
											<svg
												className="inline-block ml-2"
												width="16"
												height="16"
												viewBox="0 0 16 16"
												fill="none"
												xmlns="http://www.w3.org/2000/svg">
												<path
													d="M13.3334 4L6.00002 11.3333L2.66669 8"
													stroke="#0B0C7D"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
										)}
									</button>
								))}
							</div>
						) : (
							<button
								onClick={() => {
									onSelectType(group.category);
									onClose();
								}}
								className={`text-left text-base font-semibold py-3 transition-colors ${
									selectedType === group.category
										? "text-primary"
										: "text-[#051438] hover:text-primary"
								}`}>
								{group.category}
							</button>
						)}
					</div>
				))}
			</div>
		</div>
	);
}

