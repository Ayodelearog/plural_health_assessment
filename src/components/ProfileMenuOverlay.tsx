"use client";

import { useEffect, useRef } from "react";

interface ProfileMenuOverlayProps {
	isOpen: boolean;
	onClose: () => void;
	// selectedType: string;
	// onSelectType: (type: string) => void;
	buttonRef: React.RefObject<HTMLButtonElement | null>;
}

const profileMenuItems = [
	{
		icon: (
			<svg
				width="21"
				height="21"
				viewBox="0 0 21 21"
				fill="none"
				xmlns="http://www.w3.org/2000/svg">
				<path
					d="M4.75 17.4167V16.7498C4.75 14.5407 6.54086 12.75 8.75 12.75H11.4167C13.6258 12.75 15.4167 14.5407 15.4167 16.7498V17.4167M10.0833 4.75C8.61057 4.75 7.41667 5.94391 7.41667 7.41667C7.41667 8.88943 8.61057 10.0833 10.0833 10.0833C11.5561 10.0833 12.75 8.88943 12.75 7.41667C12.75 5.94391 11.5561 4.75 10.0833 4.75ZM10.0833 19.4167C4.92868 19.4167 0.75 15.238 0.75 10.0833C0.75 4.92868 4.92868 0.75 10.0833 0.75C15.238 0.75 19.4167 4.92868 19.4167 10.0833C19.4167 15.238 15.238 19.4167 10.0833 19.4167Z"
					stroke="#051438"
					strokeWidth="1.5"
					strokeLinecap="square"
				/>
			</svg>
		),
		label: "Profile",
	},
	{
		icon: (
			<svg
				width="21"
				height="21"
				viewBox="0 0 21 21"
				fill="none"
				xmlns="http://www.w3.org/2000/svg">
				<path
					d="M16.0833 19.4167H19.4167V17.4167C19.4167 15.5757 17.9243 14.0833 16.0833 14.0833M11.4167 4.74739C11.4167 6.95529 9.626 8.74478 7.41667 8.74478C5.20733 8.74478 3.41667 6.95529 3.41667 4.74739C3.41667 2.5395 5.20733 0.75 7.41667 0.75C9.626 0.75 11.4167 2.5395 11.4167 4.74739ZM14.0833 19.4045H0.75C0.75 18.4578 0.75 17.5571 0.75 16.7415C0.75 14.5324 2.54086 12.7422 4.75 12.7422H10.0833C12.2925 12.7422 14.0833 14.5324 14.0833 16.7415C14.0833 17.5571 14.0833 18.4578 14.0833 19.4045ZM15.4167 11.4167C13.9439 11.4167 12.75 10.2228 12.75 8.75C12.75 7.27724 13.9439 6.08333 15.4167 6.08333C16.8894 6.08333 18.0833 7.27724 18.0833 8.75C18.0833 10.2228 16.8894 11.4167 15.4167 11.4167Z"
					stroke="#051438"
					strokeWidth="1.5"
				/>
			</svg>
		),
		label: "Switch Role",
	},
	{
		icon: (
			<svg
				width="21"
				height="21"
				viewBox="0 0 21 21"
				fill="none"
				xmlns="http://www.w3.org/2000/svg">
				<path
					d="M4.75 15.4071H5.5V14.6571H4.75V15.4071ZM4.75 19.4045H4C4 19.6885 4.16045 19.9482 4.41448 20.0752C4.66852 20.2023 4.97253 20.175 5.19981 20.0046L4.75 19.4045ZM10.0833 15.4071V14.6571H9.83346L9.63352 14.8069L10.0833 15.4071ZM6.08333 5.32983H5.33333V6.82983H6.08333V6.07983V5.32983ZM14.0833 6.82983H14.8333V5.32983H14.0833V6.07983V6.82983ZM6.08333 9.32723H5.33333V10.8272H6.08333V10.0772V9.32723ZM11.4167 10.8272H12.1667V9.32723H11.4167V10.0772V10.8272ZM4.75 15.4071H4V19.4045H4.75H5.5V15.4071H4.75ZM4.75 19.4045L5.19981 20.0046L10.5331 16.0072L10.0833 15.4071L9.63352 14.8069L4.30019 18.8043L4.75 19.4045ZM10.0833 15.4071V16.1571H18.0833V15.4071V14.6571H10.0833V15.4071ZM18.0833 15.4071V16.1571C19.2344 16.1571 20.1667 15.2262 20.1667 14.0746H19.4167H18.6667C18.6667 14.3968 18.4069 14.6571 18.0833 14.6571V15.4071ZM19.4167 14.0746H20.1667V2.08244H19.4167H18.6667V14.0746H19.4167ZM19.4167 2.08244H20.1667C20.1667 0.930891 19.2344 0 18.0833 0V0.75V1.5C18.4069 1.5 18.6667 1.76028 18.6667 2.08244H19.4167ZM18.0833 0.75V0H2.08333V0.75V1.5H18.0833V0.75ZM2.08333 0.75V0C0.932267 0 0 0.930891 0 2.08244H0.75H1.5C1.5 1.76028 1.75973 1.5 2.08333 1.5V0.75ZM0.75 2.08244H0V14.0746H0.75H1.5V2.08244H0.75ZM0.75 14.0746H0C0 15.2262 0.932267 16.1571 2.08333 16.1571V15.4071V14.6571C1.75973 14.6571 1.5 14.3968 1.5 14.0746H0.75ZM2.08333 15.4071V16.1571H4.75V15.4071V14.6571H2.08333V15.4071ZM6.08333 6.07983V6.82983H14.0833V6.07983V5.32983H6.08333V6.07983ZM6.08333 10.0772V10.8272H11.4167V10.0772V9.32723H6.08333V10.0772Z"
					fill="#051438"
				/>
			</svg>
		),
		label: "Messages",
	},
	{
		icon: (
			<svg
				width="20"
				height="20"
				viewBox="0 0 20 20"
				fill="none"
				xmlns="http://www.w3.org/2000/svg">
				<path
					d="M10 2L14.3333 6M10 2L6 6M10 2V14.6667M18 9.33333V18H2V9.33333"
					stroke="#051438"
					strokeWidth="1.5"
				/>
			</svg>
		),
		label: "Upload paper records",
	},
	{
		icon: (
			<svg
				width="20"
				height="20"
				viewBox="0 0 20 20"
				fill="none"
				xmlns="http://www.w3.org/2000/svg">
				<g clipPath="url(#clip0_1966_764)">
					<path
						d="M9.99984 13.0722L7.11553 14.6667L7.6665 11.2896L5.33317 8.89812L8.55768 8.40578L9.99984 5.33332L11.442 8.40578L14.6665 8.89812L12.3332 11.2896L12.8841 14.6667L9.99984 13.0722Z"
						stroke="#051438"
						strokeWidth="1.5"
						strokeLinejoin="round"
					/>
					<path
						d="M0.666504 9.99999C0.666504 15.1546 4.84518 19.3333 9.99984 19.3333C15.1545 19.3333 19.3332 15.1546 19.3332 9.99999C19.3332 4.84533 15.1545 0.666656 9.99984 0.666656C4.84518 0.666656 0.666504 4.84533 0.666504 9.99999Z"
						stroke="#051438"
						strokeWidth="1.5"
						strokeLinejoin="round"
					/>
				</g>
				<defs>
					<clipPath id="clip0_1966_764">
						<rect width="20" height="20" fill="white" />
					</clipPath>
				</defs>
			</svg>
		),
		label: "Review paper records",
	},
	{
		icon: (
			<svg
				width="20"
				height="21"
				viewBox="0 0 20 21"
				fill="none"
				xmlns="http://www.w3.org/2000/svg">
				<path
					d="M7.33333 7.41667L12.6667 12.75M7.33333 12.75L12.6667 7.41667M14 0.75H3.33333C2.59695 0.75 2 1.34695 2 2.08333V18.0833C2 18.8197 2.59695 19.4167 3.33333 19.4167H16.6667C17.403 19.4167 18 18.8197 18 18.0833V4.75L14 0.75Z"
					stroke="#051438"
					strokeWidth="1.5"
				/>
			</svg>
		),
		label: "View rejected paper records",
	},
	{
		icon: (
			<svg
				width="21"
				height="21"
				viewBox="0 0 21 21"
				fill="none"
				xmlns="http://www.w3.org/2000/svg">
				<path
					d="M4.75 0V6.66667M15.4167 0V6.66667M4.08333 10H8.08333M16.0833 10H12.0833M4.08333 14H8.08333M12.0833 14H16.0833M2.08333 3.33333H18.0833C18.8197 3.33333 19.4167 3.93029 19.4167 4.66667V18C19.4167 18.7364 18.8197 19.3333 18.0833 19.3333H2.08333C1.34695 19.3333 0.75 18.7364 0.75 18V4.66667C0.75 3.93029 1.34695 3.33333 2.08333 3.33333Z"
					stroke="#051438"
					strokeWidth="1.5"
				/>
			</svg>
		),
		label: "Calendar",
	},
	{
		icon: (
			<svg
				width="21"
				height="21"
				viewBox="0 0 21 21"
				fill="none"
				xmlns="http://www.w3.org/2000/svg">
				<path
					d="M4.75 7.34998L4.11725 6.94732L4 7.13158V7.34998H4.75ZM8.34681 1.69785L8.97955 2.10051V2.10051L8.34681 1.69785ZM11.9027 3.71118L11.2319 3.37577V3.37577L11.9027 3.71118ZM10.0833 7.34998L9.41251 7.01457C9.29627 7.24706 9.30869 7.52316 9.44535 7.74428C9.582 7.96539 9.8234 8.09998 10.0833 8.09998V7.34998ZM19.4167 14.0166L20.0167 14.4666L20.1667 14.2666V14.0166H19.4167ZM16.2167 18.2833L16.8167 18.7333V18.7333L16.2167 18.2833ZM11.1254 1.04191L11.5113 0.398787V0.398787L11.1254 1.04191ZM0.75 6.68331H0V20.0166H0.75H1.5V6.68331H0.75ZM4.75 7.34998L5.38275 7.75264L8.97955 2.10051L8.34681 1.69785L7.71406 1.2952L4.11725 6.94732L4.75 7.34998ZM11.9027 3.71118L11.2319 3.37577L9.41251 7.01457L10.0833 7.34998L10.7542 7.68539L12.5736 4.04659L11.9027 3.71118ZM10.0833 7.34998V8.09998H16.75V7.34998V6.59998H10.0833V7.34998ZM19.4167 10.0166H18.6667V14.0166H19.4167H20.1667V10.0166H19.4167ZM19.4167 14.0166L18.8167 13.5666L15.6167 17.8333L16.2167 18.2833L16.8167 18.7333L20.0167 14.4666L19.4167 14.0166ZM14.0833 19.35V18.6H7.41667V19.35V20.1H14.0833V19.35ZM4.75 16.6833H5.5V7.34998H4.75H4V16.6833H4.75ZM16.75 7.34998V8.09998C17.8085 8.09998 18.6667 8.9581 18.6667 10.0166H19.4167H20.1667C20.1667 8.12967 18.637 6.59998 16.75 6.59998V7.34998ZM7.41667 19.35V18.6C6.35812 18.6 5.5 17.7419 5.5 16.6833H4.75H4C4 18.5703 5.52969 20.1 7.41667 20.1V19.35ZM11.1254 1.04191L10.7396 1.68503C11.3202 2.03341 11.5347 2.77011 11.2319 3.37577L11.9027 3.71118L12.5736 4.04659C13.2269 2.73988 12.7641 1.15044 11.5113 0.398787L11.1254 1.04191ZM16.2167 18.2833L15.6167 17.8333C15.2547 18.3159 14.6866 18.6 14.0833 18.6V19.35V20.1C15.1588 20.1 16.1714 19.5936 16.8167 18.7333L16.2167 18.2833ZM8.34681 1.69785L8.97955 2.10051C9.35666 1.50791 10.1372 1.32364 10.7396 1.68503L11.1254 1.04191L11.5113 0.398787C10.2118 -0.380918 8.52768 0.0166504 7.71406 1.2952L8.34681 1.69785Z"
					fill="#051438"
				/>
			</svg>
		),
		label: "Give feedback",
	},
	{
		icon: (
			<svg
				width="21"
				height="21"
				viewBox="0 0 21 21"
				fill="none"
				xmlns="http://www.w3.org/2000/svg">
				<path
					d="M10.0837 11.4167V0.75M3.574 3.41488C1.83933 5.10844 0.75 7.46168 0.75 10.0773C0.75 15.2286 4.93 19.4167 10.0833 19.4167C15.2393 19.4167 19.4167 15.2286 19.4167 10.0773C19.4167 7.46568 18.3407 5.10844 16.61 3.41488"
					stroke="#FF4D4D"
					strokeWidth="1.5"
					strokeLinecap="square"
				/>
			</svg>
		),
		label: "Sign out",
	},
];

export default function ProfileMenuOverlay({
	isOpen,
	onClose,
	// selectedType,
	// onSelectType,
	buttonRef,
}: ProfileMenuOverlayProps) {
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
			className="fixed bg-[#FFFFFF] rounded-[10px] shadow-xl  p-5 z-[60] animate-fadeIn"
			style={{
				top: buttonRect ? `${buttonRect.bottom + 8}px` : "0px",
				left: buttonRect ? `${buttonRect.left - 350}px` : "0px",
				minWidth: "400px",
			}}>
			{/* Header */}
			<div className="flex items-center justify-between mb-6 pb-[18px] border-b border-[#DFE2E9]">
				{/* <h3 className="text-[22px] font-bold text-[#051438]">
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
                </button> */}

				<div className="flex items-center gap-3">
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

					<div>
						<h1 className="text-base font-semibold text-[#051438]">
							{" "}
							Gbenga Arakanmi
						</h1>
						<p className="text-base font-medium text-[#677597]">
							Front Desk Analyst
						</p>
					</div>
				</div>

				<div className="px-2 py-1 bg-[#EFF1F4] rounded-[5px]">
					<p className="font-semibold text-sm text-[#677597]">Primary</p>
				</div>
			</div>

			<div className="flex flex-col gap-2 ">
				{profileMenuItems.map((item, index) => {
					return (
						<button key={index} className="flex items-center gap-4">
							{item.icon}
							{item.label === "Sign out" ? (
								<p className="font-medium text-base text-[#FF4D4D]">
									{item.label}
								</p>
							) : (
								<p className="font-medium text-base text-[#051438]">
									{item.label}
								</p>
							)}
						</button>
					);
				})}
			</div>
		</div>
	);
}
