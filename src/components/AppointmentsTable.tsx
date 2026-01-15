"use client";

import { JSX, useState, useRef, useEffect, Fragment } from "react";
import {
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	MoreVertical,
	User,
} from "lucide-react";
import { appointments } from "@/src/data/data";
import ClinicDropdown from "./ClinicDropdown";
import SortDropdown from "./SortDropdown";
import HighlightText from "./HighlightText";

interface AppointmentsTableProps {
	searchQuery: string;
	setIsAddAppointmentModalOpen: (isOpen: boolean) => void;
	isaddPatientModalOpen: boolean;
}

interface ActionsMenuProps {
	isOpen: boolean;
	onClose: () => void;
	buttonRef: React.RefObject<HTMLButtonElement>;
	patientName: string;
	setIsAddAppointmentModalOpen: (isOpen: boolean) => void;
	isaddPatientModalOpen: boolean;
}

function ActionsMenu({
	isOpen,
	onClose,
	buttonRef,
	patientName,
	setIsAddAppointmentModalOpen,
	isaddPatientModalOpen,
}: ActionsMenuProps) {
	const menuRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				menuRef.current &&
				!menuRef.current.contains(event.target as Node) &&
				buttonRef.current &&
				!buttonRef.current.contains(event.target as Node)
			) {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen, onClose, buttonRef]);

	useEffect(() => {
		if (!isOpen || !menuRef.current || !buttonRef.current) return;

		const buttonRect = buttonRef.current.getBoundingClientRect();
		const menu = menuRef.current;

		menu.style.top = `${buttonRect.bottom + 1}px`;
		menu.style.left = `${buttonRect.left - 280}px`;
	}, [isOpen, buttonRef]);

	if (!isOpen) return null;

	const menuItems = [
		{ label: "Create appointment", highlighted: false },
		{ label: "Create invoice", highlighted: true },
		{ label: "View patient profile", highlighted: false },
		{ label: "View next of kin", highlighted: false },
		{ label: "Add demographic info", highlighted: false },
		{ label: "Update insurance details", highlighted: false },
		{ label: "Scan paper records", highlighted: false },
	];

	return (
		<div
			ref={menuRef}
			className="fixed z-50 w-[300px] bg-white border border-[#DFE2E9] rounded-[10px] shadow-xl overflow-hidden py-3 "
			style={{
				boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
			}}>
			{menuItems.map((item, index) => (
				<button
					key={index}
					className={`w-full px-6 py-[8.5px] text-left text-sm font-semibold text-[#051438] hover:bg-[#E7E7FC] transition-colors ${
						item.highlighted ? " " : ""
					}`}
					onClick={() => {
						// trigger create appointment modal
						if (item.label === "Create appointment") {
							if (!isaddPatientModalOpen) {
								setIsAddAppointmentModalOpen(true);
							}
						}
						// alert(`${item.label} clicked for ${patientName}`);
						onClose();
					}}>
					{item.label}
				</button>
			))}
		</div>
	);
}

export default function AppointmentsTable({
	searchQuery,
	setIsAddAppointmentModalOpen,
	isaddPatientModalOpen,
}: AppointmentsTableProps) {
	const [selectedClinic, setSelectedClinic] = useState("All clinics");
	const [expandedRows, setExpandedRows] = useState<number[]>([]);
	const [isClinicDropdownOpen, setIsClinicDropdownOpen] = useState(false);
	const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
	const [selectedSort, setSelectedSort] = useState("");
	const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

	const clinicButtonRef = useRef<HTMLButtonElement>(null);
	const sortButtonRef = useRef<HTMLButtonElement>(null);

	const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
	const menuButtonRefs = useRef<Record<number, HTMLButtonElement | null>>({});

	const toggleMenu = (id: number): void => {
		setActiveMenuId((prev: number | null) => (prev === id ? null : id));
	};

	// Debounce search query
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearchQuery(searchQuery);
		}, 300); // 300ms debounce

		return () => clearTimeout(timer);
	}, [searchQuery]);

	const toggleRow = (id: number) => {
		setExpandedRows((prev) =>
			prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
		);
	};

	const getSortLabel = () => {
		const sortOptions = [
			{ id: "patient-name-asc", label: "Patient name: A-Z" },
			{ id: "patient-name-desc", label: "Patient name: Z-A" },
			{ id: "patient-id-asc", label: "Patient ID: Ascending" },
			{ id: "patient-id-desc", label: "Patient ID: Descending" },
			{ id: "gender-male", label: "Gender: Male" },
			{ id: "gender-female", label: "Gender: Female" },
		];
		const option = sortOptions.find((opt) => opt.id === selectedSort);
		return option ? option.label : "Sort by";
	};

	// Search filter - filters by patient name, patient ID, clinic, status
	const getSearchedAppointments = () => {
		if (!debouncedSearchQuery.trim()) {
			return appointments;
		}

		const query = debouncedSearchQuery.toLowerCase().trim();

		return appointments.filter((appointment) => {
			const searchableFields = [
				appointment.patientName.toLowerCase(),
				appointment.patientId.toLowerCase(),
				appointment.clinic.toLowerCase(),
				appointment.status.toLowerCase(),
				appointment.gender.toLowerCase(),
				appointment.age.toLowerCase(),
			];

			return searchableFields.some((field) => field.includes(query));
		});
	};

	// Filter appointments by clinic
	const getFilteredAppointments = (
		appointmentsToFilter: typeof appointments
	) => {
		if (selectedClinic === "All clinics") {
			return appointmentsToFilter;
		}
		return appointmentsToFilter.filter(
			(appointment) => appointment.clinic === selectedClinic
		);
	};

	// Sort appointments based on selected criteria
	const getSortedAppointments = (appointmentsToSort: typeof appointments) => {
		const sorted = [...appointmentsToSort];

		switch (selectedSort) {
			case "patient-name-asc":
				return sorted.sort((a, b) =>
					a.patientName.localeCompare(b.patientName)
				);
			case "patient-name-desc":
				return sorted.sort((a, b) =>
					b.patientName.localeCompare(a.patientName)
				);
			case "patient-id-asc":
				return sorted.sort((a, b) => a.patientId.localeCompare(b.patientId));
			case "patient-id-desc":
				return sorted.sort((a, b) => b.patientId.localeCompare(a.patientId));
			case "gender-male":
				return sorted.filter((a) => a.gender === "Male");
			case "gender-female":
				return sorted.filter((a) => a.gender === "Female");
			default:
				return sorted;
		}
	};

	// Data flow: Raw Data → Search → Clinic Filter → Sort → Display
	const searchedAppointments = getSearchedAppointments();
	const filteredAppointments = getFilteredAppointments(searchedAppointments);
	const displayedAppointments = getSortedAppointments(filteredAppointments);

	const getStatusColor = (status: string) => {
		const colors: Record<string, string> = {
			Processing: "bg-[#FFF6DB] text-[#D6AB00]",
			"Not arrived": "bg-red-100 text-red-600",
			"Awaiting vitals": "bg-purple-100 text-purple-600",
			"Awaiting doctor": "bg-blue-100 text-blue-600",
			"Admitted to ward": "bg-amber-100 text-amber-600",
			"Transferred to A&E": "bg-violet-100 text-violet-600",
			"Seen doctor": "bg-green-100 text-green-600",
		};
		return colors[status] || "bg-gray-100 text-gray-600";
	};

	const getStatusBgColor = (status: string) => {
		const bgColors: Record<string, string> = {
			Processing: "bg-[#FFF6DB]",
			"Not arrived": "bg-red-100",
			"Awaiting vitals": "bg-purple-100",
			"Awaiting doctor": "bg-blue-100",
			"Admitted to ward": "bg-amber-100",
			"Transferred to A&E": "bg-violet-100",
			"Seen doctor": "bg-green-100",
		};
		return bgColors[status] || "bg-gray-100";
	};

	const getStatusTextColor = (status: string) => {
		const textColors: Record<string, string> = {
			Processing: "text-[#D6AB00]",
			"Not arrived": "text-red-600",
			"Awaiting vitals": "text-purple-600",
			"Awaiting doctor": "text-blue-600",
			"Admitted to ward": "text-amber-600",
			"Transferred to A&E": "text-violet-600",
			"Seen doctor": "text-green-600",
		};
		return textColors[status] || "text-gray-600";
	};

	const getStatusIcon = (status: string) => {
		const icons: Record<string, JSX.Element> = {
			Processing: (
				<svg
					width="16"
					height="16"
					viewBox="0 0 16 16"
					fill="none"
					xmlns="http://www.w3.org/2000/svg">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8ZM5.86675 5.11237L8.75433 7.99995L5.86675 10.8875L5.1125 10.1333L7.24583 7.99995L5.1125 5.86662L5.86675 5.11237ZM9.06675 5.11237L11.9543 7.99995L9.06675 10.8875L8.3125 10.1333L10.4458 7.99995L8.3125 5.86662L9.06675 5.11237Z"
						fill="#D6AB00"
					/>
				</svg>
			),
			"Not arrived": (
				<svg
					width="15"
					height="15"
					viewBox="0 0 15 15"
					fill="none"
					xmlns="http://www.w3.org/2000/svg">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M0 7.5C0 3.35786 3.35786 0 7.5 0C11.6421 0 15 3.35786 15 7.5C15 11.6421 11.6421 15 7.5 15C3.35786 15 0 11.6421 0 7.5ZM4 8H11V7H4V8Z"
						fill="#FF2C2C"
					/>
				</svg>
			),
			"Awaiting vitals": (
				<svg
					width="15"
					height="15"
					viewBox="0 0 15 15"
					fill="none"
					xmlns="http://www.w3.org/2000/svg">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M0 7.5C0 3.35786 3.35786 0 7.5 0C11.6421 0 15 3.35786 15 7.5C15 11.6421 11.6421 15 7.5 15C3.35786 15 0 11.6421 0 7.5ZM4.14635 5.14648C4.8939 4.39893 6.10591 4.39893 6.85346 5.14648L7.49991 5.79292L8.14635 5.14648C8.8939 4.39893 10.1059 4.39893 10.8535 5.14648C11.601 5.89402 11.601 7.10603 10.8535 7.85358L7.49991 11.2071L4.14635 7.85358C3.39881 7.10604 3.39881 5.89402 4.14635 5.14648Z"
						fill="#A22CFF"
					/>
				</svg>
			),
			"Awaiting doctor": (
				<svg
					width="15"
					height="15"
					viewBox="0 0 15 15"
					fill="none"
					xmlns="http://www.w3.org/2000/svg">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M0 7.5C0 3.35786 3.35786 0 7.5 0C11.6421 0 15 3.35786 15 7.5C15 11.6421 11.6421 15 7.5 15C3.35786 15 0 11.6421 0 7.5ZM4.14635 5.14648C4.8939 4.39893 6.10591 4.39893 6.85346 5.14648L7.49991 5.79292L8.14635 5.14648C8.8939 4.39893 10.1059 4.39893 10.8535 5.14648C11.601 5.89402 11.601 7.10603 10.8535 7.85358L7.49991 11.2071L4.14635 7.85358C3.39881 7.10604 3.39881 5.89402 4.14635 5.14648Z"
						fill="#0B0C7D"
					/>
				</svg>
			),
			"Admitted to ward": (
				<svg
					width="16"
					height="16"
					viewBox="0 0 16 16"
					fill="none"
					xmlns="http://www.w3.org/2000/svg">
					<rect width="16" height="16" rx="8" fill="#FF8B00" />
					<g clipPath="url(#clip0_2_4551)">
						<path
							d="M6.96541 6.34221C6.98624 6.28414 7.04465 6.24836 7.10586 6.25637C7.16705 6.26433 7.21441 6.31384 7.21966 6.37532L7.42938 8.82553L7.82209 7.41C7.83816 7.35212 7.89119 7.31237 7.95147 7.31388C8.01148 7.3152 8.06296 7.35711 8.07646 7.41561L8.29515 8.36434L8.66854 6.79553C8.68311 6.73415 8.73943 6.69212 8.80237 6.69481C8.86538 6.6978 8.91739 6.74523 8.92616 6.80769L9.20482 8.79431L9.32974 8.39055C9.34676 8.3356 9.39759 8.29814 9.45511 8.29814H12.4103V7.62167C12.4103 6.9972 11.904 6.49079 11.2792 6.49079H9.48376V4.69531C9.48376 4.07055 8.9775 3.56433 8.35279 3.56433H7.69955H7.5965C6.97193 3.56433 6.46538 4.07057 6.46538 4.69531V6.49077H4.66984C4.04559 6.49077 3.53906 6.99718 3.53906 7.62164V8.31255H6.25839L6.96541 6.34221Z"
							fill="white"
						/>
						<path
							d="M9.28218 9.43324C9.26398 9.49193 9.20737 9.53025 9.14628 9.52526C9.08499 9.52027 9.03536 9.47354 9.02685 9.41264L8.76318 7.53288L8.42111 8.97015C8.40703 9.02928 8.35419 9.07102 8.29345 9.07102C8.29331 9.07102 8.29314 9.07102 8.29297 9.07102C8.23203 9.07078 8.17925 9.02866 8.16556 8.96924L7.93719 7.97841L7.48767 9.59865C7.47175 9.65588 7.41968 9.69477 7.36129 9.69477C7.35724 9.69477 7.35317 9.69458 7.34907 9.69425C7.28579 9.68835 7.23585 9.63804 7.23045 9.57475L7.0098 6.99664L6.47466 8.48815C6.45596 8.54033 6.40655 8.57507 6.35114 8.57507H3.55688C3.65015 9.10569 4.11314 9.50898 4.67024 9.50898H6.46577V11.3045C6.46577 11.9292 6.97232 12.4357 7.59689 12.4357H7.69994H8.35318C8.97789 12.4357 9.48415 11.9292 9.48415 11.3045V9.50898H11.2796C11.8422 9.50898 12.3086 9.09838 12.3958 8.56063H9.55222L9.28218 9.43324Z"
							fill="white"
						/>
						<path
							d="M12.8688 8.29814H12.4107H9.45547C9.39795 8.29814 9.3471 8.33561 9.3301 8.39054L9.20518 8.79431L8.92653 6.80768C8.91775 6.74522 8.86575 6.6978 8.80274 6.6948C8.7398 6.69211 8.68348 6.73415 8.6689 6.79553L8.29551 8.36434L8.07682 7.41561C8.06332 7.3571 8.01184 7.31519 7.95183 7.31387C7.89155 7.31236 7.83852 7.35214 7.82245 7.41L7.42974 8.82553L7.22002 6.37531C7.21477 6.31384 7.16741 6.2643 7.10623 6.25636C7.04499 6.24836 6.98661 6.28413 6.96577 6.3422L6.2588 8.31257H3.53945H3.13125C3.05877 8.31257 3 8.37134 3 8.44384C3 8.5163 3.05874 8.57507 3.13125 8.57507H3.55688H6.35108C6.40652 8.57507 6.45591 8.54032 6.47461 8.48815L7.00974 6.99664L7.2304 9.57474C7.23582 9.63804 7.28576 9.68835 7.34901 9.69424C7.35311 9.69458 7.35719 9.69477 7.36124 9.69477C7.41965 9.69477 7.4717 9.65588 7.48762 9.59865L7.93713 7.97839L8.16551 8.96922C8.1792 9.02865 8.23197 9.07076 8.29292 9.071C8.29309 9.071 8.29326 9.071 8.2934 9.071C8.35413 9.071 8.40698 9.02928 8.42105 8.97013L8.76313 7.53288L9.0268 9.41264C9.03531 9.47354 9.08496 9.52029 9.14622 9.52526C9.20732 9.53024 9.26392 9.49193 9.28212 9.43323L9.55217 8.56058H12.3958H12.8688C12.9413 8.56058 13 8.50184 13 8.42936C13 8.35688 12.9413 8.29814 12.8688 8.29814Z"
							fill="#FF8B00"
						/>
					</g>
					<defs>
						<clipPath id="clip0_2_4551">
							<rect
								width="10"
								height="10"
								fill="white"
								transform="translate(3 3)"
							/>
						</clipPath>
					</defs>
				</svg>
			),
			"Transferred to A&E": (
				<svg
					width="16"
					height="16"
					viewBox="0 0 16 16"
					fill="none"
					xmlns="http://www.w3.org/2000/svg">
					<rect width="16" height="16" rx="8" fill="#A22CFF" />
					<g clipPath="url(#clip0_2_4592)">
						<path
							d="M6.96541 6.34221C6.98624 6.28414 7.04465 6.24836 7.10586 6.25637C7.16705 6.26433 7.21441 6.31384 7.21966 6.37532L7.42938 8.82553L7.82209 7.41C7.83816 7.35212 7.89119 7.31237 7.95147 7.31388C8.01148 7.3152 8.06296 7.35711 8.07646 7.41561L8.29515 8.36434L8.66854 6.79553C8.68311 6.73415 8.73943 6.69212 8.80237 6.69481C8.86538 6.6978 8.91739 6.74523 8.92616 6.80769L9.20482 8.79431L9.32974 8.39055C9.34676 8.3356 9.39759 8.29814 9.45511 8.29814H12.4103V7.62167C12.4103 6.9972 11.904 6.49079 11.2792 6.49079H9.48376V4.69531C9.48376 4.07055 8.9775 3.56433 8.35279 3.56433H7.69955H7.5965C6.97193 3.56433 6.46538 4.07057 6.46538 4.69531V6.49077H4.66984C4.04559 6.49077 3.53906 6.99718 3.53906 7.62164V8.31255H6.25839L6.96541 6.34221Z"
							fill="white"
						/>
						<path
							d="M9.28218 9.43324C9.26398 9.49193 9.20737 9.53025 9.14628 9.52526C9.08499 9.52027 9.03536 9.47354 9.02685 9.41264L8.76318 7.53288L8.42111 8.97015C8.40703 9.02928 8.35419 9.07102 8.29345 9.07102C8.29331 9.07102 8.29314 9.07102 8.29297 9.07102C8.23203 9.07078 8.17925 9.02866 8.16556 8.96924L7.93719 7.97841L7.48767 9.59865C7.47175 9.65588 7.41968 9.69477 7.36129 9.69477C7.35724 9.69477 7.35317 9.69458 7.34907 9.69425C7.28579 9.68835 7.23585 9.63804 7.23045 9.57475L7.0098 6.99664L6.47466 8.48815C6.45596 8.54033 6.40655 8.57507 6.35114 8.57507H3.55688C3.65015 9.10569 4.11314 9.50898 4.67024 9.50898H6.46577V11.3045C6.46577 11.9292 6.97232 12.4357 7.59689 12.4357H7.69994H8.35318C8.97789 12.4357 9.48415 11.9292 9.48415 11.3045V9.50898H11.2796C11.8422 9.50898 12.3086 9.09838 12.3958 8.56063H9.55222L9.28218 9.43324Z"
							fill="white"
						/>
						<path
							d="M12.8688 8.29814H12.4107H9.45547C9.39795 8.29814 9.3471 8.33561 9.3301 8.39054L9.20518 8.79431L8.92653 6.80768C8.91775 6.74522 8.86575 6.6978 8.80274 6.6948C8.7398 6.69211 8.68348 6.73415 8.6689 6.79553L8.29551 8.36434L8.07682 7.41561C8.06332 7.3571 8.01184 7.31519 7.95183 7.31387C7.89155 7.31236 7.83852 7.35214 7.82245 7.41L7.42974 8.82553L7.22002 6.37531C7.21477 6.31384 7.16741 6.2643 7.10623 6.25636C7.04499 6.24836 6.98661 6.28413 6.96577 6.3422L6.2588 8.31257H3.53945H3.13125C3.05877 8.31257 3 8.37134 3 8.44384C3 8.5163 3.05874 8.57507 3.13125 8.57507H3.55688H6.35108C6.40652 8.57507 6.45591 8.54032 6.47461 8.48815L7.00974 6.99664L7.2304 9.57474C7.23582 9.63804 7.28576 9.68835 7.34901 9.69424C7.35311 9.69458 7.35719 9.69477 7.36124 9.69477C7.41965 9.69477 7.4717 9.65588 7.48762 9.59865L7.93713 7.97839L8.16551 8.96922C8.1792 9.02865 8.23197 9.07076 8.29292 9.071C8.29309 9.071 8.29326 9.071 8.2934 9.071C8.35413 9.071 8.40698 9.02928 8.42105 8.97013L8.76313 7.53288L9.0268 9.41264C9.03531 9.47354 9.08496 9.52029 9.14622 9.52526C9.20732 9.53024 9.26392 9.49193 9.28212 9.43323L9.55217 8.56058H12.3958H12.8688C12.9413 8.56058 13 8.50184 13 8.42936C13 8.35688 12.9413 8.29814 12.8688 8.29814Z"
							fill="#A22CFF"
						/>
					</g>
					<defs>
						<clipPath id="clip0_2_4592">
							<rect
								width="10"
								height="10"
								fill="white"
								transform="translate(3 3)"
							/>
						</clipPath>
					</defs>
				</svg>
			),
			"Seen doctor": (
				<svg
					width="15"
					height="15"
					viewBox="0 0 15 15"
					fill="none"
					xmlns="http://www.w3.org/2000/svg">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M0 7.5C0 3.35786 3.35786 0 7.5 0C11.6421 0 15 3.35786 15 7.5C15 11.6421 11.6421 15 7.5 15C3.35786 15 0 11.6421 0 7.5ZM7.0718 10.7106L11.3905 5.31232L10.6096 4.68762L6.92825 9.2893L4.32012 7.11586L3.67993 7.88408L7.0718 10.7106Z"
						fill="#27AE60"
					/>
				</svg>
			),
		};
		return icons[status] || "";
	};

	const getStatusDocIcon = (status: string) => {
		const icons: Record<string, JSX.Element> = {
			Processing: (
				<svg
					width="16"
					height="16"
					viewBox="0 0 16 16"
					fill="none"
					xmlns="http://www.w3.org/2000/svg">
					<path
						d="M9.25293 1.88235C8.95259 2.4015 8.78029 3.00411 8.78027 3.647C8.78027 4.38951 9.00974 5.07854 9.40137 5.647H6.58789V6.58841H10.3525V6.58353C10.9127 6.95764 11.5854 7.17624 12.3096 7.1763C12.6088 7.1763 12.8993 7.138 13.1768 7.0679V14.5884C13.1767 15.368 12.5443 15.9995 11.7646 15.9995H2.35254C1.57308 15.9993 0.941499 15.3679 0.941406 14.5884V9.41165H2.35254C4.17181 9.41165 5.64743 7.93697 5.64746 6.11771V1.88235H9.25293ZM3.76465 12.2349H10.3525V11.2945H3.76465V12.2349ZM6.58789 9.41165H10.3525V8.47025H6.58789V9.41165ZM0.941406 6.11771C0.941437 6.89724 1.57305 7.5296 2.35254 7.52982C3.13222 7.52982 3.76462 6.89738 3.76465 6.11771V3.29446C3.76465 3.03457 3.55384 2.82376 3.29395 2.82376C3.03413 2.82385 2.82324 3.03462 2.82324 3.29446V6.58841H1.88281V3.29446C1.88281 2.51483 2.51433 1.88245 3.29395 1.88235C4.07364 1.88235 4.70605 2.51477 4.70605 3.29446V6.11771C4.70602 7.41717 3.65201 8.47025 2.35254 8.47025C1.05325 8.47003 3.10332e-05 7.41704 0 6.11771V1.88235H0.941406V6.11771Z"
						fill="#051438"
					/>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M9.70587 3.64706C9.70587 2.18513 10.891 1 12.3529 1C13.8149 1 15 2.18513 15 3.64706C15 5.10899 13.8149 6.29412 12.3529 6.29412C10.891 6.29412 9.70587 5.10899 9.70587 3.64706ZM12.1765 3.82353V2.41176H12.5294V3.82353H12.1765ZM12.5294 4.52941V4.88588H12.1765V4.52941H12.5294Z"
						fill="#D6AB00"
					/>
				</svg>
			),
			"Not arrived": (
				<svg
					width="16"
					height="16"
					viewBox="0 0 16 16"
					fill="none"
					xmlns="http://www.w3.org/2000/svg">
					<path
						d="M9.25293 1.88235C8.95259 2.4015 8.78029 3.00411 8.78027 3.647C8.78027 4.38951 9.00974 5.07854 9.40137 5.647H6.58789V6.58841H10.3525V6.58353C10.9127 6.95764 11.5854 7.17624 12.3096 7.1763C12.6088 7.1763 12.8993 7.138 13.1768 7.0679V14.5884C13.1767 15.368 12.5443 15.9995 11.7646 15.9995H2.35254C1.57308 15.9993 0.941499 15.3679 0.941406 14.5884V9.41165H2.35254C4.17181 9.41165 5.64743 7.93697 5.64746 6.11771V1.88235H9.25293ZM3.76465 12.2349H10.3525V11.2945H3.76465V12.2349ZM6.58789 9.41165H10.3525V8.47025H6.58789V9.41165ZM0.941406 6.11771C0.941437 6.89724 1.57305 7.5296 2.35254 7.52982C3.13222 7.52982 3.76462 6.89738 3.76465 6.11771V3.29446C3.76465 3.03457 3.55384 2.82376 3.29395 2.82376C3.03413 2.82385 2.82324 3.03462 2.82324 3.29446V6.58841H1.88281V3.29446C1.88281 2.51483 2.51433 1.88245 3.29395 1.88235C4.07364 1.88235 4.70605 2.51477 4.70605 3.29446V6.11771C4.70602 7.41717 3.65201 8.47025 2.35254 8.47025C1.05325 8.47003 3.10332e-05 7.41704 0 6.11771V1.88235H0.941406V6.11771Z"
						fill="#051438"
					/>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M9.70587 3.64706C9.70587 2.18513 10.891 1 12.3529 1C13.8149 1 15 2.18513 15 3.64706C15 5.10899 13.8149 6.29412 12.3529 6.29412C10.891 6.29412 9.70587 5.10899 9.70587 3.64706ZM12.1765 3.82353V2.41176H12.5294V3.82353H12.1765ZM12.5294 4.52941V4.88588H12.1765V4.52941H12.5294Z"
						fill="#FF2C2C"
					/>
				</svg>
			),
			"Awaiting vitals": (
				<svg
					width="16"
					height="16"
					viewBox="0 0 16 16"
					fill="none"
					xmlns="http://www.w3.org/2000/svg">
					<path
						d="M9.25293 1.88235C8.95259 2.4015 8.78029 3.00411 8.78027 3.647C8.78027 4.38951 9.00974 5.07854 9.40137 5.647H6.58789V6.58841H10.3525V6.58353C10.9127 6.95764 11.5854 7.17624 12.3096 7.1763C12.6088 7.1763 12.8993 7.138 13.1768 7.0679V14.5884C13.1767 15.368 12.5443 15.9995 11.7646 15.9995H2.35254C1.57308 15.9993 0.941499 15.3679 0.941406 14.5884V9.41165H2.35254C4.17181 9.41165 5.64743 7.93697 5.64746 6.11771V1.88235H9.25293ZM3.76465 12.2349H10.3525V11.2945H3.76465V12.2349ZM6.58789 9.41165H10.3525V8.47025H6.58789V9.41165ZM0.941406 6.11771C0.941437 6.89724 1.57305 7.5296 2.35254 7.52982C3.13222 7.52982 3.76462 6.89738 3.76465 6.11771V3.29446C3.76465 3.03457 3.55384 2.82376 3.29395 2.82376C3.03413 2.82385 2.82324 3.03462 2.82324 3.29446V6.58841H1.88281V3.29446C1.88281 2.51483 2.51433 1.88245 3.29395 1.88235C4.07364 1.88235 4.70605 2.51477 4.70605 3.29446V6.11771C4.70602 7.41717 3.65201 8.47025 2.35254 8.47025C1.05325 8.47003 3.10332e-05 7.41704 0 6.11771V1.88235H0.941406V6.11771Z"
						fill="#051438"
					/>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M9.70587 3.64706C9.70587 2.18513 10.891 1 12.3529 1C13.8149 1 15 2.18513 15 3.64706C15 5.10899 13.8149 6.29412 12.3529 6.29412C10.891 6.29412 9.70587 5.10899 9.70587 3.64706ZM12.1765 3.82353V2.41176H12.5294V3.82353H12.1765ZM12.5294 4.52941V4.88588H12.1765V4.52941H12.5294Z"
						fill="#FF2C2C"
					/>
				</svg>
			),
			"Awaiting doctor": (
				<svg
					width="16"
					height="16"
					viewBox="0 0 16 16"
					fill="none"
					xmlns="http://www.w3.org/2000/svg">
					<path
						d="M9.25293 1.88235C8.95259 2.4015 8.78029 3.00411 8.78027 3.647C8.78027 4.38951 9.00974 5.07854 9.40137 5.647H6.58789V6.58841H10.3525V6.58353C10.9127 6.95764 11.5854 7.17624 12.3096 7.1763C12.6088 7.1763 12.8993 7.138 13.1768 7.0679V14.5884C13.1767 15.368 12.5443 15.9995 11.7646 15.9995H2.35254C1.57308 15.9993 0.941499 15.3679 0.941406 14.5884V9.41165H2.35254C4.17181 9.41165 5.64743 7.93697 5.64746 6.11771V1.88235H9.25293ZM3.76465 12.2349H10.3525V11.2945H3.76465V12.2349ZM6.58789 9.41165H10.3525V8.47025H6.58789V9.41165ZM0.941406 6.11771C0.941437 6.89724 1.57305 7.5296 2.35254 7.52982C3.13222 7.52982 3.76462 6.89738 3.76465 6.11771V3.29446C3.76465 3.03457 3.55384 2.82376 3.29395 2.82376C3.03413 2.82385 2.82324 3.03462 2.82324 3.29446V6.58841H1.88281V3.29446C1.88281 2.51483 2.51433 1.88245 3.29395 1.88235C4.07364 1.88235 4.70605 2.51477 4.70605 3.29446V6.11771C4.70602 7.41717 3.65201 8.47025 2.35254 8.47025C1.05325 8.47003 3.10332e-05 7.41704 0 6.11771V1.88235H0.941406V6.11771Z"
						fill="#051438"
					/>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M9.70587 3.64706C9.70587 2.18513 10.891 1 12.3529 1C13.8149 1 15 2.18513 15 3.64706C15 5.10899 13.8149 6.29412 12.3529 6.29412C10.891 6.29412 9.70587 5.10899 9.70587 3.64706ZM12.1765 3.82353V2.41176H12.5294V3.82353H12.1765ZM12.5294 4.52941V4.88588H12.1765V4.52941H12.5294Z"
						fill="#FF2C2C"
					/>
				</svg>
			),
			"Admitted to ward": (
				<svg
					width="16"
					height="16"
					viewBox="0 0 16 16"
					fill="none"
					xmlns="http://www.w3.org/2000/svg">
					<path
						d="M9.25293 1.88235C8.95259 2.4015 8.78029 3.00411 8.78027 3.647C8.78027 4.38951 9.00974 5.07854 9.40137 5.647H6.58789V6.58841H10.3525V6.58353C10.9127 6.95764 11.5854 7.17624 12.3096 7.1763C12.6088 7.1763 12.8993 7.138 13.1768 7.0679V14.5884C13.1767 15.368 12.5443 15.9995 11.7646 15.9995H2.35254C1.57308 15.9993 0.941499 15.3679 0.941406 14.5884V9.41165H2.35254C4.17181 9.41165 5.64743 7.93697 5.64746 6.11771V1.88235H9.25293ZM3.76465 12.2349H10.3525V11.2945H3.76465V12.2349ZM6.58789 9.41165H10.3525V8.47025H6.58789V9.41165ZM0.941406 6.11771C0.941437 6.89724 1.57305 7.5296 2.35254 7.52982C3.13222 7.52982 3.76462 6.89738 3.76465 6.11771V3.29446C3.76465 3.03457 3.55384 2.82376 3.29395 2.82376C3.03413 2.82385 2.82324 3.03462 2.82324 3.29446V6.58841H1.88281V3.29446C1.88281 2.51483 2.51433 1.88245 3.29395 1.88235C4.07364 1.88235 4.70605 2.51477 4.70605 3.29446V6.11771C4.70602 7.41717 3.65201 8.47025 2.35254 8.47025C1.05325 8.47003 3.10332e-05 7.41704 0 6.11771V1.88235H0.941406V6.11771Z"
						fill="#051438"
					/>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M9.70587 3.64706C9.70587 2.18513 10.891 1 12.3529 1C13.8149 1 15 2.18513 15 3.64706C15 5.10899 13.8149 6.29412 12.3529 6.29412C10.891 6.29412 9.70587 5.10899 9.70587 3.64706ZM12.1765 3.82353V2.41176H12.5294V3.82353H12.1765ZM12.5294 4.52941V4.88588H12.1765V4.52941H12.5294Z"
						fill="#FF2C2C"
					/>
				</svg>
			),
			"Transferred to A&E": (
				<svg
					width="16"
					height="16"
					viewBox="0 0 16 16"
					fill="none"
					xmlns="http://www.w3.org/2000/svg">
					<path
						d="M9.25293 1.88235C8.95259 2.4015 8.78029 3.00411 8.78027 3.647C8.78027 4.38951 9.00974 5.07854 9.40137 5.647H6.58789V6.58841H10.3525V6.58353C10.9127 6.95764 11.5854 7.17624 12.3096 7.1763C12.6088 7.1763 12.8993 7.138 13.1768 7.0679V14.5884C13.1767 15.368 12.5443 15.9995 11.7646 15.9995H2.35254C1.57308 15.9993 0.941499 15.3679 0.941406 14.5884V9.41165H2.35254C4.17181 9.41165 5.64743 7.93697 5.64746 6.11771V1.88235H9.25293ZM3.76465 12.2349H10.3525V11.2945H3.76465V12.2349ZM6.58789 9.41165H10.3525V8.47025H6.58789V9.41165ZM0.941406 6.11771C0.941437 6.89724 1.57305 7.5296 2.35254 7.52982C3.13222 7.52982 3.76462 6.89738 3.76465 6.11771V3.29446C3.76465 3.03457 3.55384 2.82376 3.29395 2.82376C3.03413 2.82385 2.82324 3.03462 2.82324 3.29446V6.58841H1.88281V3.29446C1.88281 2.51483 2.51433 1.88245 3.29395 1.88235C4.07364 1.88235 4.70605 2.51477 4.70605 3.29446V6.11771C4.70602 7.41717 3.65201 8.47025 2.35254 8.47025C1.05325 8.47003 3.10332e-05 7.41704 0 6.11771V1.88235H0.941406V6.11771Z"
						fill="#051438"
					/>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M9.70587 3.64706C9.70587 2.18513 10.891 1 12.3529 1C13.8149 1 15 2.18513 15 3.64706C15 5.10899 13.8149 6.29412 12.3529 6.29412C10.891 6.29412 9.70587 5.10899 9.70587 3.64706ZM12.1765 3.82353V2.41176H12.5294V3.82353H12.1765ZM12.5294 4.52941V4.88588H12.1765V4.52941H12.5294Z"
						fill="#FF2C2C"
					/>
				</svg>
			),
			"Seen doctor": (
				<svg
					width="16"
					height="16"
					viewBox="0 0 16 16"
					fill="none"
					xmlns="http://www.w3.org/2000/svg">
					<path
						d="M9.25293 1.88235C8.95259 2.4015 8.78029 3.00411 8.78027 3.647C8.78027 4.38951 9.00974 5.07854 9.40137 5.647H6.58789V6.58841H10.3525V6.58353C10.9127 6.95764 11.5854 7.17624 12.3096 7.1763C12.6088 7.1763 12.8993 7.138 13.1768 7.0679V14.5884C13.1767 15.368 12.5443 15.9995 11.7646 15.9995H2.35254C1.57308 15.9993 0.941499 15.3679 0.941406 14.5884V9.41165H2.35254C4.17181 9.41165 5.64743 7.93697 5.64746 6.11771V1.88235H9.25293ZM3.76465 12.2349H10.3525V11.2945H3.76465V12.2349ZM6.58789 9.41165H10.3525V8.47025H6.58789V9.41165ZM0.941406 6.11771C0.941437 6.89724 1.57305 7.5296 2.35254 7.52982C3.13222 7.52982 3.76462 6.89738 3.76465 6.11771V3.29446C3.76465 3.03457 3.55384 2.82376 3.29395 2.82376C3.03413 2.82385 2.82324 3.03462 2.82324 3.29446V6.58841H1.88281V3.29446C1.88281 2.51483 2.51433 1.88245 3.29395 1.88235C4.07364 1.88235 4.70605 2.51477 4.70605 3.29446V6.11771C4.70602 7.41717 3.65201 8.47025 2.35254 8.47025C1.05325 8.47003 3.10332e-05 7.41704 0 6.11771V1.88235H0.941406V6.11771Z"
						fill="#051438"
					/>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M9.66281 3.64706C9.66281 2.18513 10.8479 1 12.3099 1C13.7718 1 14.9569 2.18513 14.9569 3.64706C14.9569 5.10899 13.7718 6.29412 12.3099 6.29412C10.8479 6.29412 9.66281 5.10899 9.66281 3.64706ZM12.1587 4.78023L13.683 2.87494L13.4074 2.65445L12.1081 4.27858L11.1876 3.51148L10.9616 3.78262L12.1587 4.78023Z"
						fill="#27AE60"
					/>
				</svg>
			),
		};
		return icons[status] || "";
	};

	return (
		<div className="flex-1 flex flex-col overflow-hidden">
			{/* Table Header Controls */}
			<div className="flex-shrink-0 flex items-center gap-[64px] justify-between mb-[14px]">
				<div className="flex items-center gap-6">
					<h2 className="text-lg font-bold text-[#051438]">Appointments</h2>

					<button
						ref={clinicButtonRef}
						onClick={() => setIsClinicDropdownOpen(!isClinicDropdownOpen)}
						className="flex items-center gap-2.5 transition-colors hover:opacity-80">
						<span className="text-lg font-bold text-[#051438]">
							{selectedClinic}
						</span>
						{/* <ChevronDown className="w-4 h-4 text-[#051438] border-" /> */}
						<svg
							width="15"
							height="15"
							viewBox="0 0 15 15"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path
								d="M4.5 6.5L7.5 9.5L10.5 6.5"
								stroke="#051438"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</button>

					<button
						ref={sortButtonRef}
						onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
						className="flex items-center gap-2.5 transition-colors hover:opacity-80">
						{/* <ArrowUpDown className="w-4 h-4 text-gray-500" /> */}
						<svg
							width="18"
							height="18"
							viewBox="0 0 18 18"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M3.60005 15.9515V0.6C3.60005 0.268629 3.86867 0 4.20005 0C4.53142 0 4.80005 0.268629 4.80005 0.6V15.9515L6.95152 13.8C7.18583 13.5657 7.56573 13.5657 7.80005 13.8C8.03436 14.0343 8.03436 14.4142 7.80005 14.6485L4.62431 17.8243C4.39 18.0586 4.0101 18.0586 3.77578 17.8243L0.600046 14.6485C0.365731 14.4142 0.365731 14.0343 0.600045 13.8C0.83436 13.5657 1.21426 13.5657 1.44857 13.8L3.60005 15.9515ZM18 4.2C18 4.53137 17.7314 4.8 17.4 4.8H11.4C11.0687 4.8 10.8 4.53137 10.8 4.2C10.8 3.86863 11.0687 3.6 11.4 3.6H17.4C17.7314 3.6 18 3.86863 18 4.2ZM15.6 9C15.6 9.33137 15.3314 9.6 15 9.6H11.4C11.0687 9.6 10.8 9.33137 10.8 9C10.8 8.66863 11.0687 8.4 11.4 8.4H15C15.3314 8.4 15.6 8.66863 15.6 9ZM13.2 13.8C13.2 14.1314 12.9314 14.4 12.6 14.4H11.4C11.0687 14.4 10.8 14.1314 10.8 13.8C10.8 13.4686 11.0687 13.2 11.4 13.2H12.6C12.9314 13.2 13.2 13.4686 13.2 13.8Z"
								fill="#0B0C7D"
							/>
						</svg>

						<span className="text-lg font-bold text-[#051438]">
							{getSortLabel()}
						</span>
					</button>
				</div>

				<div className="flex items-center gap-4">
					<span className="text-[#677597] text-base font-medium">
						1 - {Math.min(20, displayedAppointments.length)}{" "}
						<span className="text-[#051438] mx-2">of</span>{" "}
						{displayedAppointments.length}
					</span>
					<div className="flex gap-2">
						<button className="p-1 hover:bg-gray-100 rounded transition-colors border border-[#DFE2E9] bg-[#E6E8EB]">
							<ChevronLeft className="w-5 h-5 text-[#051438]" />
						</button>
						<button className="p-1 hover:bg-gray-100 rounded transition-colors border border-[#DFE2E9] bg-[#FFFFFF]">
							<ChevronRight className="w-5 h-5 text-gray-600" />
						</button>
					</div>
				</div>
			</div>

			{/* Table */}
			<div className="flex-1 flex flex-col overflow-hidden  rounded-lg">
				<div className="overflow-x-auto">
					<table className="w-full border-collapse">
						<thead className="bg-[#EDF0F8] sticky top-0 z-10">
							<tr>
								<th className="w-[50px] px-2  text-left "></th>
								<th className="w-[60px] px-4  text-left text-base font-bold text-[#A6AFC2] uppercase tracking-wider ">
									#
								</th>
								<th className="min-w-[300px] px-4  text-left text-base font-bold text-[#A6AFC2] uppercase tracking-wider ">
									Patient information
								</th>
								<th className="w-[200px] px-4  text-left text-base font-bold text-[#A6AFC2] uppercase tracking-wider ">
									Clinic
								</th>
								<th className="w-[180px] px-4  text-left text-base font-bold text-[#A6AFC2] uppercase tracking-wider ">
									Wallet bal. (₦)
								</th>
								<th className="w-[150px] px-4  text-left text-base font-bold text-[#A6AFC2] uppercase tracking-wider ">
									Time/Date
								</th>
								<th className="w-[180px] px-4  text-left text-base font-bold text-[#A6AFC2] uppercase tracking-wider ">
									Status
								</th>
								<th className="w-[60px] px-4  "></th>
							</tr>
						</thead>
						<tbody className="">
							{displayedAppointments.length === 0 ? (
								<tr>
									<td colSpan={8} className="px-4 py-16 text-center">
										<div className="flex flex-col items-center justify-center gap-3">
											<div className="text-6xl opacity-20">
												{debouncedSearchQuery ? "🔍" : "📋"}
											</div>
											<p className="text-lg font-semibold text-gray-600">
												{debouncedSearchQuery
													? "No search results found"
													: "No appointments found"}
											</p>
											<p className="text-sm text-gray-500">
												{debouncedSearchQuery ? (
													<>
														No results for{" "}
														<span className="font-semibold text-gray-700">
															"{debouncedSearchQuery}"
														</span>
														<br />
														Try a different search term
													</>
												) : selectedClinic !== "All clinics" ? (
													`No appointments for ${selectedClinic}`
												) : (
													"Try adjusting your filters"
												)}
											</p>
										</div>
									</td>
								</tr>
							) : (
								displayedAppointments.map((appointment, index) => (
									<Fragment key={`appointment-${appointment.id}`}>
										{index !== 0 && (
											<tr key={`spacer-${appointment.id}`} className="h-2"></tr>
										)}
										<tr
											className={`hover:bg-gray-50 transition-colors bg-white ${
												expandedRows.includes(appointment.id)
													? "bg-blue-50"
													: ""
											}`}>
											{/* Expand/Collapse Column with Orange Indicator */}
											<td className="w-[50px] px-2 py-[14px] relative rounded-l-[10px]">
												{appointment.status !== "Seen doctor" && (
													<div className="w-1.5 h-full bg-[#FFA500] absolute left-0 top-0 rounded-r-full rotate-180"></div>
												)}
												<button
													onClick={() => toggleRow(appointment.id)}
													className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors">
													{expandedRows.includes(appointment.id) ? (
														<ChevronDown className="w-4 h-4 text-gray-600" />
													) : (
														<ChevronRight className="w-4 h-4 text-gray-600" />
													)}
												</button>
											</td>

											{/* Row Number */}
											<td className="w-[60px] px-4 py-[14px]">
												<span className="text-[#051438] text-base font-semibold">
													{index + 1}
												</span>
											</td>

											{/* Patient Info */}
											<td className="min-w-[300px] px-4 py-[14px]">
												<div className="flex items-center gap-3">
													<div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
														<User className="w-5 h-5 text-gray-500" />
													</div>
													<div>
														<div className="flex items-center gap-2">
															<span className="font-semibold text-[#051438] text-base">
																<HighlightText
																	text={appointment.patientName}
																	query={debouncedSearchQuery}
																/>
															</span>
														</div>
														<span className="text-xs text-[#677597] font-bold">
															<HighlightText
																text={appointment.patientId}
																query={debouncedSearchQuery}
															/>{" "}
															• {appointment.gender} • {appointment.age}
														</span>
													</div>

													<div className="ml-auto flex items-center gap-2">
														{appointment.isNew && (
															<span className="p-1.5 bg-[#D0D1FB] text-primary text-xs font-semibold rounded">
																New
															</span>
														)}

														<div
															className={`p-2 rounded-md flex items-center justify-center ${getStatusBgColor(
																appointment.status
															)}`}>
															{getStatusDocIcon(appointment.status)}
														</div>
													</div>
												</div>
											</td>

											{/* Clinic */}
											<td className="w-[200px] px-4 py-[14px]">
												<div className="flex items-center gap-2">
													{/* {appointment.isNew && (
													<span className="px-2 py-0.5 bg-blue-100 text-primary text-xs font-medium rounded">
														New
													</span>
												)} */}
													{/* <span className="text-2xl">
													{appointment.clinicIcon}
												</span> */}
													<span className="text-[#051438] text-base font-semibold">
														<HighlightText
															text={appointment.clinic}
															query={debouncedSearchQuery}
														/>
													</span>
												</div>
											</td>

											{/* Wallet Balance */}
											<td className="w-[180px] px-4 py-[14px]">
												<span className="text-[#051438] font-semibold text-base">
													{appointment.walletBalance.toLocaleString()}
												</span>
											</td>

											{/* Time/Date */}
											<td className="w-[150px] px-4 py-[14px]">
												<div className="text-base">
													<div
														className={`font-semibold ${getStatusTextColor(
															appointment.status
														)}`}>
														{appointment.time}
													</div>
													<div
														className={`${getStatusTextColor(
															appointment.status
														)}`}>
														{appointment.date}
													</div>
												</div>
											</td>

											{/* Status */}
											<td className="w-[180px] px-4 py-[14px]">
												<span
													className={`whitespace-nowrap inline-flex items-center gap-1 px-3 py-1 rounded-[8px] text-base font-semibold ${getStatusColor(
														appointment.status
													)}`}>
													{appointment.status}
													<span className="ml-2">
														{getStatusIcon(appointment.status)}
													</span>
												</span>
											</td>

											{/* More Options */}
											<td className="w-[60px] px-4 py-[14px] rounded-r-[10px]">
												<button
													ref={(el) => {
														menuButtonRefs.current[appointment.id] = el;
													}}
													onClick={() => toggleMenu(appointment.id)}
													className="p-1 hover:bg-gray-200 rounded transition-colors">
													<MoreVertical className="w-5 h-5 text-gray-400" />
												</button>
											</td>
										</tr>
									</Fragment>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Dropdown Overlays */}
			<ClinicDropdown
				isOpen={isClinicDropdownOpen}
				onClose={() => setIsClinicDropdownOpen(false)}
				selectedClinic={selectedClinic}
				onSelectClinic={setSelectedClinic}
				buttonRef={clinicButtonRef}
			/>
			<SortDropdown
				isOpen={isSortDropdownOpen}
				onClose={() => setIsSortDropdownOpen(false)}
				selectedSort={selectedSort}
				onSelectSort={setSelectedSort}
				buttonRef={sortButtonRef}
			/>

			{appointments.map((appointment) => {
				const buttonRef = {
					current: menuButtonRefs.current[appointment.id] || null,
				};
				return (
					<ActionsMenu
						key={`menu-${appointment.id}`}
						isOpen={activeMenuId === appointment.id}
						onClose={() => setActiveMenuId(null)}
						buttonRef={buttonRef as React.RefObject<HTMLButtonElement>}
						patientName={appointment.patientName}
						setIsAddAppointmentModalOpen={setIsAddAppointmentModalOpen}
						isaddPatientModalOpen={isaddPatientModalOpen}
					/>
				);
			})}
		</div>
	);
}
