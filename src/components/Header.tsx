"use client";

import { Bell, User } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ProfileMenuOverlay from "./ProfileMenuOverlay";
import pluralLogo from "../public/images/Plural.png";

export default function Header() {
	const [currentTime, setCurrentTime] = useState(new Date());
	const currentDate = new Date();
	// Update time every second
	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);

		// Cleanup interval on component unmount
		return () => clearInterval(timer);
	}, []);
	const dateString = currentDate.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "long",
	});
	const timeString = currentDate.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: true,
	});

	const [isProfileMenuOverlayOpen, setIsProfileMenuOverlayOpen] =
		useState(false);

	// Refs for overlay positioning
	const profileMenuButtonRef = useRef<HTMLButtonElement>(null);

	return (
		<header className="bg-[#EDF0F8] border-b-2 border-[#DFE2E9]">
			<div className="px-8 py-2">
				<div className="flex items-center justify-between">
					{/* Logo */}
					<div className="flex items-center gap-2 relative h-8 w-[76px]">
						<Image
							src={pluralLogo}
							alt="Plural"
							fill
							className="object-contain "
						/>
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
								<svg
									width="20"
									height="20"
									viewBox="0 0 20 20"
									fill="none"
									xmlns="http://www.w3.org/2000/svg">
									<path
										d="M10.0002 0C5.95007 0 2.66683 3.28325 2.66683 7.33333V13.3333H1.3335V14.6667H18.6668V13.3333H17.3335V7.33333C17.3335 3.28325 14.0503 0 10.0002 0Z"
										fill="#0B0C7D"
									/>
									<path
										d="M6.66683 16.6667V16H13.3335V16.6667C13.3335 18.5076 11.8411 20 10.0002 20C8.15921 20 6.66683 18.5076 6.66683 16.6667Z"
										fill="#0B0C7D"
									/>
								</svg>
							</button>
							<button
								onClick={() => setIsProfileMenuOverlayOpen(true)}
								ref={profileMenuButtonRef}
								className=" rounded-full hover:bg-gray-300 transition-colors">
								<svg
									width="32"
									height="32"
									viewBox="0 0 32 32"
									fill="none"
									xmlns="http://www.w3.org/2000/svg">
									<rect width="32" height="32" rx="16" fill="#A6AFC2" />
									<path
										d="M16 8C13.9383 8 12.2666 9.67005 12.2666 11.7312C12.2666 13.7924 13.9383 15.4625 16 15.4625C18.0617 15.4625 19.7333 13.7924 19.7333 11.7312C19.7333 9.67005 18.0617 8 16 8Z"
										fill="white"
									/>
									<path
										d="M13.8666 17.5938C11.8049 17.5938 10.1333 19.2646 10.1333 21.3265V23.9903H21.8666V21.3265C21.8666 19.2646 20.195 17.5938 18.1333 17.5938H13.8666Z"
										fill="white"
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>
			</div>
			{/* Overlays */}
			<ProfileMenuOverlay
				isOpen={isProfileMenuOverlayOpen}
				onClose={() => setIsProfileMenuOverlayOpen(false)}
				buttonRef={profileMenuButtonRef}
			/>
		</header>
	);
}
