function formatDate(dateString: string, format: "long" | "short") {
    const date = new Date(dateString);

    const  day = date.getDate();
    const  month = date.toLocaleString("en-US", { month: `${format}` });
    const  year = date.getFullYear();

    return { day, month, year  };

  };

export default formatDate;