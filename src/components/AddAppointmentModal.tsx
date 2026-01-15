"use client";

import { useState, useEffect, useRef } from "react";
import {
	X,
	Search,
	Fingerprint,
	SlidersHorizontal,
	ChevronRight,
	ChevronLeft,
	Clock,
	List,
} from "lucide-react";
import SearchBar from "./SearchBar";
import ClinicSelectionOverlay from "./ClinicSelectionOverlay";
import AppointmentTypeOverlay from "./AppointmentTypeOverlay";

interface AddAppointmentModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function AddAppointmentModal({
	isOpen,
	onClose,
}: AddAppointmentModalProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedDate, setSelectedDate] = useState(new Date(2025, 8, 25)); // September 25, 2025
	const [selectedTime, setSelectedTime] = useState("09:49 AM");
	const [clinic, setClinic] = useState("Clinic");
	const [appointmentType, setAppointmentType] = useState("Appointment type");
	const [repeat, setRepeat] = useState("Does not repeat");

	// Overlay states
	const [isClinicOverlayOpen, setIsClinicOverlayOpen] = useState(false);
	const [isAppointmentTypeOverlayOpen, setIsAppointmentTypeOverlayOpen] =
		useState(false);

	// Refs for overlay positioning
	const clinicButtonRef = useRef<HTMLButtonElement>(null);
	const appointmentTypeButtonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	if (!isOpen) return null;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Appointment data:", {
			searchQuery,
			selectedDate,
			selectedTime,
			clinic,
			appointmentType,
			repeat,
		});
		onClose();
	};

	// Calendar generation
	const getDaysInMonth = (date: Date) => {
		const year = date.getFullYear();
		const month = date.getMonth();
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const daysInMonth = lastDay.getDate();
		const startingDayOfWeek = firstDay.getDay();

		const days = [];

		// Previous month days
		const prevMonthLastDay = new Date(year, month, 0).getDate();
		for (let i = startingDayOfWeek - 1; i >= 0; i--) {
			days.push({ day: prevMonthLastDay - i, isCurrentMonth: false });
		}

		// Current month days
		for (let i = 1; i <= daysInMonth; i++) {
			days.push({ day: i, isCurrentMonth: true });
		}

		// Next month days
		const remainingDays = 42 - days.length;
		for (let i = 1; i <= remainingDays; i++) {
			days.push({ day: i, isCurrentMonth: false });
		}

		return days;
	};

	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	const days = getDaysInMonth(selectedDate);

	const previousMonth = () => {
		setSelectedDate(
			new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1)
		);
	};

	const nextMonth = () => {
		setSelectedDate(
			new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1)
		);
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
				onClick={onClose}></div>

			{/* Modal */}
			<div className="relative bg-[#EDF0F8] rounded-[10px] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4 animate-in fade-in zoom-in duration-200">
				{/* Header */}
				<div className="sticky top-0 bg-[#EDF0F8]  pt-6 px-8 flex items-center justify-between">
					<h2 className="text-[22px] font-bold text-[#051438]">
						Add new appointment
					</h2>
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

				{/* Form */}
				<form onSubmit={handleSubmit} className="px-8 py-4 ">
					{/* Search Patient */}
					<div className="mb-4">
						{/* <div className="flex items-center gap-4 bg-gray-50 rounded-lg p-4">
							<div className="flex-1 relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
								<input
									type="text"
									placeholder="Find patient"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
								/>
							</div>
							<button
								type="button"
								className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
								<Fingerprint className="w-6 h-6 text-gray-400" />
							</button>
							<button
								type="button"
								className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
								<SlidersHorizontal className="w-6 h-6 text-gray-400" />
							</button>
						</div> */}
						<SearchBar
							searchQuery={searchQuery}
							onSearchChange={setSearchQuery}
						/>
					</div>

					{/* Clinic Selection */}
					<div className="mb-4">
						<div className="flex items-center justify-between pb-4 border-b border-[#CDD8F3]">
							<label className="text-[#677597] text-base font-medium">
								Clinic
							</label>
							<button
								ref={clinicButtonRef}
								type="button"
								onClick={() => setIsClinicOverlayOpen(true)}
								className="flex items-center gap-2 text-[#051438] text-base font-semibold hover:text-primary transition-colors">
								{clinic}
								<svg
									width="15"
									height="15"
									viewBox="0 0 15 15"
									fill="none"
									xmlns="http://www.w3.org/2000/svg">
									<path
										d="M6.5 10.5L9.5 7.5L6.5 4.5"
										stroke="#051438"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</button>
						</div>
					</div>

					{/* Appointment Type */}
					<div className="mb-4">
						<div className="flex items-center justify-between pb-4 border-b border-[#CDD8F3]">
							<label className="text-[#677597] text-base font-medium">
								Title
							</label>
							<button
								ref={appointmentTypeButtonRef}
								type="button"
								onClick={() => setIsAppointmentTypeOverlayOpen(true)}
								className="flex items-center gap-2 text-[#051438] text-base font-semibold hover:text-primary transition-colors">
								{appointmentType}
								<svg
									width="15"
									height="15"
									viewBox="0 0 15 15"
									fill="none"
									xmlns="http://www.w3.org/2000/svg">
									<path
										d="M6.5 10.5L9.5 7.5L6.5 4.5"
										stroke="#051438"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</button>
						</div>
					</div>

					{/* Time Selection */}
					<div className="mb-4">
						<div className="flex items-center justify-between pb-4 ">
							<label className="text-[#677597] text-base font-medium">
								Time
							</label>
							<div className="flex items-center gap-4">
								<span className="text-[#051438] text-base font-semibold">
									{selectedDate.getDate()} {monthNames[selectedDate.getMonth()]}{" "}
									{selectedDate.getFullYear()}
								</span>
								<span className="text-[#051438] text-base font-semibold">
									{selectedTime}
								</span>
							</div>
						</div>
					</div>

					{/* Calendar */}
					<div className="mb-4 bg-[#6B7A99] rounded-[10px] px-8 py-4">
						{/* Calendar Header */}
						<div className="flex items-center justify-between mb-6">
							<div className="flex items-center gap-4">
								<button
									type="button"
									className="p-2 hover:bg-white/10 rounded transition-colors">
									<List className="w-5 h-5 text-white" />
								</button>
							</div>

							<div className="px-2.5 py-[5px] flex items-center justify-between w-full max-w-[50%]">
								<button
									type="button"
									onClick={previousMonth}
									className="p-2 hover:bg-white/10 rounded transition-colors">
									<svg
										width="15"
										height="15"
										viewBox="0 0 15 15"
										fill="none"
										xmlns="http://www.w3.org/2000/svg">
										<path
											d="M5 7.49995L9.20711 11.7071L9.20711 3.29285L5 7.49995Z"
											fill="#CDD8F3"
										/>
									</svg>
								</button>

								<h3 className="text-[#CDD8F3] font-bold text-base">
									{monthNames[selectedDate.getMonth()]}{" "}
									{selectedDate.getFullYear()}
								</h3>

								<button
									type="button"
									onClick={nextMonth}
									className="p-2 hover:bg-white/10 rounded transition-colors">
									<svg
										className="rotate-180"
										width="15"
										height="15"
										viewBox="0 0 15 15"
										fill="none"
										xmlns="http://www.w3.org/2000/svg">
										<path
											d="M5 7.49995L9.20711 11.7071L9.20711 3.29285L5 7.49995Z"
											fill="#CDD8F3"
										/>
									</svg>
								</button>
							</div>

							<div className="flex items-center gap-2">
								<button
									type="button"
									className="p-2 hover:bg-white/10 rounded transition-colors">
									<svg
										width="16"
										height="16"
										viewBox="0 0 16 16"
										fill="none"
										xmlns="http://www.w3.org/2000/svg">
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8ZM7.46667 7.99991V3.2H8.53333V7.77909L11.5771 10.8229L10.8229 11.5771L7.62288 8.37712C7.51874 8.27298 7.46667 8.1364 7.46667 7.99991Z"
											fill="white"
										/>
									</svg>
								</button>
							</div>
						</div>

						{/* Calendar Grid */}
						<div className="grid grid-cols-7 gap-2">
							{/* Day Headers */}
							{["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
								<div
									key={index}
									className="text-center aspect-square w-fit text-[#051438] font-semibold text-sm py-[6px] px-[9px]">
									{day}
								</div>
							))}

							{/* Calendar Days */}
							{days.map((dayObj, index) => (
								<button
									key={index}
									type="button"
									onClick={() => {
										if (dayObj.isCurrentMonth) {
											setSelectedDate(
												new Date(
													selectedDate.getFullYear(),
													selectedDate.getMonth(),
													dayObj.day
												)
											);
										}
									}}
									className={`
                     aspect-square w-fit flex items-center justify-center rounded-full text-sm font-semibold transition-all  p-[6px]
                    ${
											!dayObj.isCurrentMonth
												? "text-white/30"
												: "text-white hover:bg-white/10"
										}
                    ${
											dayObj.isCurrentMonth &&
											dayObj.day === selectedDate.getDate()
												? "bg-[#7A90C2] rounded-full"
												: ""
										}
                  `}>
									{dayObj.day}
								</button>
							))}
						</div>
					</div>

					{/* Repeat */}
					<div className="">
						<div className="flex items-center justify-between ">
							<label className="text-[#677597] text-base font-medium">
								Repeat
							</label>
							<button
								type="button"
								className="flex items-center gap-2 text-[#051438] text-base font-semibold hover:text-primary transition-colors">
								{repeat}
								<svg
									width="15"
									height="15"
									viewBox="0 0 15 15"
									fill="none"
									xmlns="http://www.w3.org/2000/svg">
									<path
										d="M6.5 10.5L9.5 7.5L6.5 4.5"
										stroke="#051438"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</button>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex justify-end gap-8 pt-4 mt-4 mb-2">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-3 border border-[#6658F4] bg-white text-[#6658F4] rounded-[10px] font-semibold hover:bg-primary/5 transition-colors">
							Save & Close
						</button>
						<button
							type="submit"
							className="px-4 py-3 bg-primary text-white rounded-[10px] font-semibold hover:bg-primary/90 transition-colors">
							Create invoice
						</button>
					</div>
				</form>
			</div>

			{/* Overlays */}
			<ClinicSelectionOverlay
				isOpen={isClinicOverlayOpen}
				onClose={() => setIsClinicOverlayOpen(false)}
				selectedClinic={clinic}
				onSelectClinic={setClinic}
				buttonRef={clinicButtonRef}
			/>

			<AppointmentTypeOverlay
				isOpen={isAppointmentTypeOverlayOpen}
				onClose={() => setIsAppointmentTypeOverlayOpen(false)}
				selectedType={appointmentType}
				onSelectType={setAppointmentType}
				buttonRef={appointmentTypeButtonRef}
			/>
		</div>
	);
}
