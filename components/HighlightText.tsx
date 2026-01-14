interface HighlightTextProps {
	text: string;
	query: string;
}

export default function HighlightText({ text, query }: HighlightTextProps) {
	if (!query.trim()) return <>{text}</>;

	const parts = text.split(new RegExp(`(${query})`, "gi"));

	return (
		<>
			{parts.map((part, index) =>
				part.toLowerCase() === query.toLowerCase() ? (
					<mark
						key={index}
						className="bg-yellow-200 text-gray-900 font-semibold px-0.5 rounded">
						{part}
					</mark>
				) : (
					<span key={index}>{part}</span>
				)
			)}
		</>
	);
}

