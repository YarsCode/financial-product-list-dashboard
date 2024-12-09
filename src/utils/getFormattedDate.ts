export const getFormattedDate = () => {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = String(currentDate.getFullYear()).slice(-2);
    const formattedDate = `${day}.${month}.${year}`;

    return formattedDate;
};