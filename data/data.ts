export type AppointmentStatus =
	| "Processing"
	| "Not arrived"
	| "Awaiting vitals"
	| "Awaiting doctor"
	| "Admitted to ward"
	| "Transferred to A&E"
	| "Seen doctor";

export interface Appointment {
	id: number;
	patientName: string;
	patientId: string;
	gender: "Male" | "Female";
	age: string;
	clinic: string;
	clinicIcon: string;
	walletBalance: number;
	time: string;
	date: string;
	status: AppointmentStatus;
	isNew: boolean;
	avatar?: string;
}

export interface Clinic {
	id: string;
	name: string;
	icon: string;
}

export interface Patient {
	id: string;
	firstName: string;
	middleName?: string;
	lastName: string;
	title: string;
	dateOfBirth: string;
	gender: "Male" | "Female";
	phoneNumber: string;
	isNewToHospital: boolean;
}

export const clinics: Clinic[] = [
	{ id: "neurology", name: "Neurology", icon: "🧠" },
	{ id: "ent", name: "Ear, Nose & Throat", icon: "👂" },
	{ id: "emergency", name: "Accident & Emergency", icon: "🚑" },
	{ id: "cardiology", name: "Cardiology", icon: "❤️" },
	{ id: "orthopedics", name: "Orthopedics", icon: "🦴" },
];

export const appointments: Appointment[] = [
	{
		id: 1,
		patientName: "Akpopodion Endurance",
		patientId: "HOSP29386756",
		gender: "Male",
		age: "21yrs",
		clinic: "Neurology",
		clinicIcon: "🧠",
		walletBalance: 120000,
		time: "11:30 AM",
		date: "22 Sep 2025",
		status: "Processing",
		isNew: true,
	},
	{
		id: 2,
		patientName: "Boluwatife Olusola",
		patientId: "HOSP87654321",
		gender: "Female",
		age: "30yrs",
		clinic: "Ear, Nose & Throat",
		clinicIcon: "👂",
		walletBalance: 230500,
		time: "05:30 PM",
		date: "22 Sep 2025",
		status: "Not arrived",
		isNew: true,
	},
	{
		id: 3,
		patientName: "Arlie Mertz",
		patientId: "HOSP76354892",
		gender: "Female",
		age: "23days",
		clinic: "Neurology",
		clinicIcon: "🧠",
		walletBalance: 90000,
		time: "03:45 PM",
		date: "22 Sep 2025",
		status: "Awaiting vitals",
		isNew: true,
	},
	{
		id: 4,
		patientName: "Akuchi Amadi",
		patientId: "HOSP98765432",
		gender: "Female",
		age: "11mths",
		clinic: "Accident & Emergency",
		clinicIcon: "🚑",
		walletBalance: 100000,
		time: "02:00 PM",
		date: "22 Sep 2025",
		status: "Not arrived",
		isNew: true,
	},
	{
		id: 5,
		patientName: "Omolola Bakare",
		patientId: "HOSP12345789",
		gender: "Female",
		age: "26yrs",
		clinic: "Accident & Emergency",
		clinicIcon: "🚑",
		walletBalance: 180000,
		time: "01:15 PM",
		date: "22 Sep 2025",
		status: "Awaiting doctor",
		isNew: true,
	},
	{
		id: 6,
		patientName: "Ayobami Musa",
		patientId: "HOSP34567890",
		gender: "Female",
		age: "11mths",
		clinic: "Accident & Emergency",
		clinicIcon: "🚑",
		walletBalance: 190000,
		time: "12:45 PM",
		date: "22 Sep 2025",
		status: "Admitted to ward",
		isNew: true,
	},
	{
		id: 7,
		patientName: "Ngozi Okeke",
		patientId: "HOSP45678901",
		gender: "Female",
		age: "11mths",
		clinic: "Accident & Emergency",
		clinicIcon: "🚑",
		walletBalance: 200000,
		time: "10:00 AM",
		date: "22 Sep 2025",
		status: "Transferred to A&E",
		isNew: true,
	},
	{
		id: 8,
		patientName: "Chinwe Azikiwe",
		patientId: "HOSP56789012",
		gender: "Female",
		age: "11mths",
		clinic: "Accident & Emergency",
		clinicIcon: "🚑",
		walletBalance: 210000,
		time: "08:00 AM",
		date: "22 Sep 2025",
		status: "Seen doctor",
		isNew: false,
	},
	{
		id: 9,
		patientName: "Chinwe Azikiwe 2",
		patientId: "HOSP56789012",
		gender: "Female",
		age: "11mths",
		clinic: "Accident & Emergency",
		clinicIcon: "🚑",
		walletBalance: 210000,
		time: "08:00 AM",
		date: "22 Sep 2025",
		status: "Seen doctor",
		isNew: false,
	},
	{
		id: 10,
		patientName: "Chinwe Azikiwe 3",
		patientId: "HOSP56789012",
		gender: "Female",
		age: "11mths",
		clinic: "Accident & Emergency",
		clinicIcon: "🚑",
		walletBalance: 210000,
		time: "08:00 AM",
		date: "22 Sep 2025",
		status: "Seen doctor",
		isNew: false,
	},
	{
		id: 11,
		patientName: "Chinwe Azikiwe 4",
		patientId: "HOSP56789012",
		gender: "Female",
		age: "11mths",
		clinic: "Accident & Emergency",
		clinicIcon: "🚑",
		walletBalance: 210000,
		time: "08:00 AM",
		date: "22 Sep 2025",
		status: "Seen doctor",
		isNew: false,
	},
	{
		id: 12,
		patientName: "Chinwe Azikiwe 5",
		patientId: "HOSP56789012",
		gender: "Female",
		age: "11mths",
		clinic: "Accident & Emergency",
		clinicIcon: "🚑",
		walletBalance: 210000,
		time: "08:00 AM",
		date: "22 Sep 2025",
		status: "Seen doctor",
		isNew: false,
	},
];
