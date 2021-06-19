export const createPassenger = async ({
    bookingConfirmationCode,
    originAirportCode,
    destinationAirportCode,
    airplaneModel,
    departureTime,
    arrivalTime,
    givenName,
    familyName,
    dateOfBirth,
    gender,
    address,
    seatClass,
    seatNumber,
    checkInGroup
}) => {
    const url = `${process.env.REACT_APP_BOOKING_SERVICE_URL}/passengers`;
    let response;
    let data;
    try {
        response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                bookingConfirmationCode,
                originAirportCode,
                destinationAirportCode,
                airplaneModel,
                departureTime,
                arrivalTime,
                givenName,
                familyName,
                dateOfBirth,
                gender,
                address,
                seatClass,
                seatNumber,
                checkInGroup
            })
        });
        if (response.ok === false) {
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

export const searchPassengers = async (searchTerm, index, size) => {
    const url = `${process.env.REACT_APP_BOOKING_SERVICE_URL}/passengers/search?`+`term=${searchTerm}&index=${index}&size=${size}`;
    const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });
    const data = await response.json();
    if (data.error) {
        throw new Error(data.error);
    }
    return data;
}