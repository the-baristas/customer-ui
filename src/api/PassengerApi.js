import { getToken } from "../utils/Login";

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
            headers: { "Content-Type": "application/json", "Authorization": getToken() },
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
            }),
            credentials: 'include'  
        });
        if (response.ok === false) {
            throw new Error(
                `Response was not successful. Status code: ${response.status}`
            );
        }
        data = await response.json();
    } catch (e) {
        throw new Error(
            "There has been a problem with creating the passenger:",
            e
        );
    }
    return data;
};

export const deletePassenger = async (id) => {
    const url = `${process.env.REACT_APP_BOOKING_SERVICE_URL}/passengers/${id}`;
    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: { "Authorization": getToken() },
            credentials: 'include'  
        });
        if (response.ok === false) {
            throw new Error(
                `Response was not successful. Status code: ${response.status}`
            );
        }
    } catch (e) {
        console.error(
            "There has been a problem with deleting the passenger:",
            e
        );
    }
};

export const searchPassengers = async (searchTerm, index, size) => {
    const url =
        `${process.env.REACT_APP_BOOKING_SERVICE_URL}/passengers/search?` +
        `term=${searchTerm}&index=${index}&size=${size}`;
    let data;
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        if (response.ok === false) {
            throw new Error(
                `Response was unsuccessful. Status code: ${response.status}`
            );
        }
        data = await response.json();
    } catch (e) {
        console.error(
            "There has been a problem with searching for passengers:",
            e
        );
    }
    return data;
};

export const getTakenSeats = async (flightId) => {
    const url =
        `${process.env.REACT_APP_BOOKING_SERVICE_URL}/passengers/taken-seats?` +
        `flightId=${flightId}`;
    let data;
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json", "Authorization": getToken() }
        });
        if (response.ok === false) {
            throw new Error(
                `Response was unsuccessful. Status code: ${response.status}`
            );
        }
        data = await response.json();
    } catch (e) {
        console.error(
            "There has been a problem with getting the taken seats or there are no taken seats.",
            e
        );
    }
    return data;
};