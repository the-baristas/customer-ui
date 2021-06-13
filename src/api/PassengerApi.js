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
