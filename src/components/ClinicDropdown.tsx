"use client";

import { useEffect, useRef } from "react";

interface ClinicDropdownProps {
	isOpen: boolean;
	onClose: () => void;
	selectedClinic: string;
	onSelectClinic: (clinic: string) => void;
	buttonRef: React.RefObject<HTMLButtonElement | null>;
}

const clinics = [
	{ name: "All clinics", icon: null },
	{ name: "Neurology", icon: "" },
	{ name: "Ear, Nose & Throat", icon: "" },
	{ name: "Accident & Emergency", icon: "" },
	{ name: "Cardiology", icon: "" },
	{ name: "Orthopedics", icon: "" },
];

export default function ClinicDropdown({
	isOpen,
	onClose,
	selectedClinic,
	onSelectClinic,
	buttonRef,
}: ClinicDropdownProps) {
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
			className="fixed bg-white rounded-[16px] shadow-lg border border-gray-200 py-4 px-6 z-50 animate-fadeIn"
			style={{
				top: buttonRect ? `${buttonRect.bottom + 8}px` : "0px",
				left: buttonRect ? `${buttonRect.left}px` : "0px",
				minWidth: "300px",
			}}>
			<div className="flex flex-col gap-4">
				{clinics.map((clinic) => (
					<button
						key={clinic.name}
						onClick={() => {
							onSelectClinic(clinic.name);
							onClose();
						}}
						className={`text-left text-lg font-medium transition-colors hover:text-primary ${
							selectedClinic === clinic.name
								? "text-primary font-bold"
								: "text-[#051438]"
						}`}>
						{clinic.icon && <span className="mr-2">{clinic.icon}</span>}
						{clinic.name}
					</button>
				))}
			</div>
		</div>
	);
}
