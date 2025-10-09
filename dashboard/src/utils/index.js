export const formatDateTime = (isoString) => {
	const date = new Date(isoString);

	// Example: "September 9, 2025 7:00PM"
	const options = {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	};

	return date.toLocaleString("en-US", options);
};

export const getCurrentDateTime = () => {
	const now = new Date();

	// Format time as HH:MM:SS
	const hours = String(now.getHours()).padStart(2, "0");
	const minutes = String(now.getMinutes()).padStart(2, "0");
	const seconds = String(now.getSeconds()).padStart(2, "0");
	const time = `${hours}:${minutes}:${seconds}`;

	// Format date as "Month Day, Year"
	const options = { year: "numeric", month: "long", day: "numeric" };
	const date = now.toLocaleDateString("en-US", options);

	return { date, time };
}

export const getBgColor = () => {
    const colors = [
        "#b73e3e",
        "#5b45b0",
        "#7f167f",
        "#735f32",
        "#1d2569",
        "#285430"
    ]

    return colors[Math.floor(Math.random() * colors.length)]
}