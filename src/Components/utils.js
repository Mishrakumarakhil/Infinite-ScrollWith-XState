export const formattedDate = (time) => {
    const timestamp = time * 1000;
    const date = new Date(timestamp);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const hours = date.getUTCHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = String(date.getUTCMinutes()).padStart(2, "0");

    const formattedDate = `${
      months[date.getUTCMonth()]
    } ${date.getUTCDate()}, ${date.getUTCFullYear()} ${formattedHours}:${formattedMinutes} ${ampm} IST`;

    return formattedDate;
  };