"use client";

import { Bell, User } from "lucide-react";

export default function Header() {
	const currentDate = new Date();
	const dateString = currentDate.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "long",
	});
	const timeString = currentDate.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});

	return (
		<header className="bg-[#EDF0F8] border-b-2 border-[#DFE2E9]">
			<div className="px-8 py-2">
				<div className="flex items-center justify-between">
					{/* Logo */}
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
							<span className="text-white font-bold text-lg">P</span>
						</div>
						<span className="text-xl font-bold text-[#051438]">Plural</span>
					</div>

					{/* Date and Time */}
					<div className="flex items-center gap-4 text-lg">
						<span className="text-[#051438] font-bold ">{dateString}</span>
						<span className="text-[#677597] font-semibold">{timeString}</span>
					</div>

					<div className="flex items-center gap-8">
						{/* User Info */}
						<div className="flex items-center gap-4">
							<span className="text-[#051438] font-bold">Hi Mr Daniel</span>
							<button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
								<Bell className="w-5 h-5 text-primary" />
							</button>
							<button className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors">
								<User className="w-8 h-8 text-[#A6AFC2]" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
