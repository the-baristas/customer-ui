export const createBooking = async ({
    confirmationCode,
    layoverCount = 0,
    username
}) => {
    const url = `${process.env.REACT_APP_BOOKING_SERVICE_URL}/bookings`;
    let response;
    let data;
    try {
        response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ confirmationCode, layoverCount, username })
        });
        if (!response.ok) {
            throw new Error(
                `Response was not successful. Status code: ${response.statusText}`
            );
        }
        data = await response.json();
    } catch (e) {
        console.error("There has been a problem with your fetch operation:", e);
        data = {};
    }
    return data;
};

export const updateBooking = async ({}) => {};
