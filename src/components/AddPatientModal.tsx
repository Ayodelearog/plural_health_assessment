"use client";

import { useState, useEffect } from "react";
import {
	X,
	User,
	ChevronDown,
	Fingerprint,
	Calendar,
	AlertCircle,
} from "lucide-react";
import { Switch } from "@/src/components/ui/switch";

interface AddPatientModalProps {
	isOpen: boolean;
	onClose: () => void;
	onOpenAppointmentModal?: () => void;
}

export default function AddPatientModal({
	isOpen,
	onClose,
	onOpenAppointmentModal,
}: AddPatientModalProps) {
	const [formData, setFormData] = useState({
		patientId: "HOSP98765433",
		firstName: "",
		middleName: "",
		lastName: "",
		title: "",
		dateOfBirth: "",
		gender: "",
		phoneNumber: "",
		isNewToHospital: false,
	});

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
		console.log("Patient data:", formData);
		onClose();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
				onClick={onClose}></div>

			{/* Modal */}
			<div className="relative bg-[#EDF0F8] rounded-2xl shadow-2xl w-full max-w-[70%] max-h-[90vh] overflow-y-auto m-4 animate-in fade-in zoom-in duration-200">
				{/* Header */}
				<div className="sticky top-0  px-8 pt-6 flex items-start justify-between">
					<div>
						<h2 className="text-lg font-bold text-[#051438]">
							Add new patient
						</h2>
						<p className="text-[#677597] text-sm mt-2">
							Fill in the patient information in the fields provided below
						</p>
					</div>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 bg-[#DFE2E9] rounded-full transition-colors">
						<X className="w-4 h-4 text-[#0B0C7D]" />
					</button>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="px-8 py-4">
					<div className="flex items-center justify-between">
						{/* Avatar and buttons */}
						<div className="flex items-center gap-8">
							{/* Avatar */}
							<div className="flex-shrink-0">
								<div className="w-[100px] h-[100px] bg-[#A6AFC2] rounded-full flex items-center justify-center">
									<User className="w-12 h-12 text-gray-400" />
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex-1 justify-center">
								<div className="flex gap-8 mb-4">
									<button
										type="button"
										className="bg-primary text-white px-4 py-3 rounded-[10px] font-semibold text-base flex items-center gap-2 hover:bg-primary/90 transition-colors">
										Take patient's picture
										<ChevronDown className="w-4 h-4" />
									</button>
									<button
										type="button"
										className="bg-primary text-white px-4 py-3 rounded-[10px] font-semibold text-base flex items-center gap-2 hover:bg-primary/90 transition-colors">
										Add fingerprint
										<Fingerprint className="w-4 h-4" />
									</button>
								</div>
								<p className="text-base font-medium text-[#7A90C2]">
									Patient picture should be updated by reception personnel
								</p>
							</div>
						</div>

						{/* Patient ID */}
						<div className="flex-shrink-0 flex flex-col items-end">
							<div className="flex items-start gap-2 bg-[#D7E3FC] rounded-[10px] px-3 py-2 w-fit">
								<svg
									width="15"
									height="15"
									viewBox="0 0 15 15"
									fill="none"
									xmlns="http://www.w3.org/2000/svg">
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M15 7.5C15 11.6421 11.6421 15 7.5 15C3.35786 15 0 11.6421 0 7.5C0 3.35786 3.35787 0 7.5 0C11.6421 0 15 3.35786 15 7.5ZM7 4.99999V3.98999H8V4.99999H7ZM8 6.99999V9.99999H9V11H6V9.99999H7V7.99999H6V6.99999H8Z"
										fill="#FF8B00"
									/>
								</svg>

								<p className="text-[10px] font-semibold text-[#051438">
									If there is an existing Patient ID, input <br /> the patient's
									existing ID into this field
								</p>
							</div>

							<div className="flex items-center gap-4 mt-1">
								<label className="text-base font-semibold text-[#677597]">
									Patient ID
								</label>
								<div className="flex items-center relative px-3 py-2.5 bg-white rounded-[10px] border border-[#DFE2E9]">
									<input
										type="text"
										value={formData.patientId}
										onChange={(e) =>
											setFormData({ ...formData, patientId: e.target.value })
										}
										className="flex-1 px-1 outline-none focus:outline-none active:outline-none mr-2"
									/>
									<svg
										width="16"
										height="16"
										viewBox="0 0 16 16"
										fill="none"
										xmlns="http://www.w3.org/2000/svg">
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8ZM7.46667 5.33332V4.25599H8.53333V5.33332H7.46667ZM8.53333 7.46666V10.6667H9.6V11.7333H6.4V10.6667H7.46667V8.53332H6.4V7.46666H8.53333Z"
											fill="#A6AFC2"
										/>
									</svg>
								</div>
							</div>
						</div>
					</div>

					{/* Form Fields Row 1 */}
					<div className="flex gap-4 mt-4 mb-4">
						<div style={{ width: "30%" }} className="flex items-start gap-1">
							{/* <label className="block text-sm font-medium text-gray-700 mb-1">
								First name <span className="text-red-500">*</span>
							</label> */}
							<input
								type="text"
								placeholder="First name"
								required
								value={formData.firstName}
								onChange={(e) =>
									setFormData({ ...formData, firstName: e.target.value })
								}
								className="w-full px-3 py-2 border border-gray-300 placeholder:text-base placeholder:text-[#A6AFC2] placeholder:font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
							/>
							<span className="text-red-500">*</span>
						</div>
						<div style={{ width: "30%" }} className="flex items-start gap-1">
							{/* <label className="block text-sm font-medium text-gray-700 mb-1">
								Middle name <span className="text-red-500">*</span>
							</label> */}
							<input
								type="text"
								placeholder="Middle name"
								value={formData.middleName}
								onChange={(e) =>
									setFormData({ ...formData, middleName: e.target.value })
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg placeholder:text-base placeholder:text-[#A6AFC2] placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
							/>
						</div>
						<div style={{ width: "30%" }} className="flex items-start gap-1">
							{/* <label className="block text-sm font-medium text-gray-700 mb-1">
								Last name <span className="text-red-500">*</span>
							</label> */}
							<input
								type="text"
								placeholder="Last name"
								required
								value={formData.lastName}
								onChange={(e) =>
									setFormData({ ...formData, lastName: e.target.value })
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg placeholder:text-base placeholder:text-[#A6AFC2] placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
							/>
							<span className="text-red-500">*</span>
						</div>
						<div style={{ width: "10%" }}>
							{/* <label className="block text-sm font-medium text-gray-700 mb-1">
								Title
							</label> */}
							<div className="relative">
								<select
									value={formData.title}
									onChange={(e) =>
										setFormData({ ...formData, title: e.target.value })
									}
									className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none bg-white">
									<option
										value=""
										className="text-base text-[#A6AFC2] font-medium">
										Title
									</option>
									<option value="Mr">Mr</option>
									<option value="Mrs">Mrs</option>
									<option value="Miss">Miss</option>
									<option value="Dr">Dr</option>
								</select>
								<ChevronDown
									className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
									size={16}
								/>
							</div>
						</div>
					</div>

					{/* Form Fields Row 2 */}
					<div className="grid grid-cols-4 gap-5 mb-6 py-1">
						<div className="flex items-start gap-1 relative">
							<input
								type="date"
								placeholder="Date of birth"
								required
								value={formData.dateOfBirth}
								onChange={(e) =>
									setFormData({ ...formData, dateOfBirth: e.target.value })
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg placeholder:text-base placeholder:text-[#A6AFC2] placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
							/>
							{/* <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" /> */}
							<span className="text-red-500">*</span>
						</div>

						<div className="flex items-start gap-1 ">
							{/* <label className="block text-sm font-medium text-gray-700 mb-1">
								Gender <span className="text-red-500">*</span>
							</label> */}
							<select
								required
								value={formData.gender}
								onChange={(e) =>
									setFormData({ ...formData, gender: e.target.value })
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none bg-white">
								<option
									value=""
									className="font-medium text-base text-[#A6AFC2]">
									Gender
								</option>
								<option value="Male">Male</option>
								<option value="Female">Female</option>
							</select>
							<span className="text-red-500">*</span>
						</div>

						<div className="flex items-start gap-1 ">
							<input
								type="tel"
								placeholder="Phone number"
								required
								value={formData.phoneNumber}
								onChange={(e) =>
									setFormData({ ...formData, phoneNumber: e.target.value })
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-base placeholder:text-[#A6AFC2] placeholder:font-medium"
							/>
							<span className="text-red-500">*</span>
						</div>
						{/* New to Hospital Toggle */}
						<div className="flex flex-col items-start gap-1">
							<label
								htmlFor="hospital-toggle"
								className="text-base font-semibold text-[#677597]">
								Is patient new to the hospital?
							</label>
							<Switch
								id="hospital-toggle"
								checked={formData.isNewToHospital}
								onCheckedChange={(checked) =>
									setFormData({
										...formData,
										isNewToHospital: checked,
									})
								}
							/>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex justify-end gap-8 pt-4 mt-[15%] pb-4">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-3 border border-[#6658F4] text-base text-[#6658F4] rounded-[10px] bg-white font-semibold hover:bg-primary/5 transition-colors">
							Save & close
						</button>
						<button
							type="button"
							onClick={() => {
								onClose();
								onOpenAppointmentModal?.();
							}}
							className="px-4 py-3 bg-primary text-white rounded-[10px] text-base font-semibold hover:bg-primary/90 transition-colors">
							Create appointment
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
