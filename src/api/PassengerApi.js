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
    const response = await fetch(url, {
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
    const data = await response.json();
    if (data.error) {
        throw new Error(data.error);
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