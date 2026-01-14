"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import AppointmentsTable from "@/components/AppointmentsTable";
import AddPatientModal from "@/components/AddPatientModal";
import AddAppointmentModal from "@/components/AddAppointmentModal";

export default function Home() {
	const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
	const [isAddAppointmentModalOpen, setIsAddAppointmentModalOpen] =
		useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	return (
		<>
			{/* Fixed Section: Search Bar and Action Buttons */}
			<div className="flex-shrink-0 px-8 py-4 bg-[#EDF0F8]">
				<SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

				{/* Action Buttons */}
				<div className="flex gap-4 mb-6 mt-2">
					<button
						onClick={() => setIsAddPatientModalOpen(true)}
						className="bg-primary text-white px-4 py-3 rounded-[10px] font-semibold text-base flex items-center gap-2 hover:bg-primary/90 transition-colors">
						Add new patient
						<svg
							width="17"
							height="16"
							viewBox="0 0 17 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M0 8C0 3.58172 3.60012 0 8.04108 0C12.4821 0 16.0822 3.58172 16.0822 8C16.0822 12.4183 12.4821 16 8.04108 16C3.60012 16 0 12.4183 0 8ZM7.50501 11.7333V8.53333H4.28858V7.46667H7.50501V4.26667H8.57716V7.46667H11.7936V8.53333H8.57716V11.7333H7.50501Z"
								fill="white"
							/>
						</svg>
					</button>

					<button
						onClick={() => setIsAddAppointmentModalOpen(true)}
						className="bg-primary text-white px-4 py-3 rounded-[10px] font-semibold text-base flex items-center gap-2 hover:bg-primary/90 transition-colors ml-auto">
						Create appointment
						<svg
							width="17"
							height="16"
							viewBox="0 0 17 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M14.474 2.13333H12.8657V0H11.7936V2.13333H4.28858V0H3.21643V2.13333H1.60822C0.720023 2.13333 0 2.84968 0 3.73333V14.4C0 15.2837 0.720024 16 1.60822 16H14.474C15.3621 16 16.0822 15.2837 16.0822 14.4V3.73333C16.0822 2.84968 15.3621 2.13333 14.474 2.13333ZM3.75251 9.63333C3.75251 9.90948 3.97636 10.1333 4.25251 10.1333H6.96894V12.8333C6.96894 13.1095 7.1928 13.3333 7.46894 13.3333H8.61323C8.88937 13.3333 9.11323 13.1095 9.11323 12.8333V10.1333H11.8297C12.1058 10.1333 12.3297 9.90948 12.3297 9.63333V8.5C12.3297 8.22386 12.1058 8 11.8297 8H9.11323V5.3C9.11323 5.02386 8.88937 4.8 8.61323 4.8H7.46894C7.1928 4.8 6.96894 5.02386 6.96894 5.3V8H4.25251C3.97636 8 3.75251 8.22386 3.75251 8.5V9.63333Z"
								fill="white"
							/>
						</svg>
					</button>
				</div>
			</div>

			{/* Scrollable Section: Appointments Table */}
			<div className="flex-1 overflow-hidden px-8 pb-4 bg-[#EDF0F8] flex flex-col">
				<AppointmentsTable searchQuery={searchQuery} />
			</div>

			<AddPatientModal
				isOpen={isAddPatientModalOpen}
				onClose={() => setIsAddPatientModalOpen(false)}
			/>

			<AddAppointmentModal
				isOpen={isAddAppointmentModalOpen}
				onClose={() => setIsAddAppointmentModalOpen(false)}
			/>
		</>
	);
}
