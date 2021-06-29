import { getCsrfToken, getToken } from "../utils/Login";

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
            headers: { "Content-Type": "application/json", "Authorization": getToken(), "X-XSRF-TOKEN": await getCsrfToken() },
            body: JSON.stringify({ confirmationCode, layoverCount, username }),
            credentials: 'include'
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

export const updateBooking = async ({
    id,
    confirmationCode,
    layoverCount,
    totalPrice,
    username
}) => {
    const url = `${process.env.REACT_APP_BOOKING_SERVICE_URL}/bookings/${id}`;
    let response;
    let data;
    try {
        response = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": getToken(), "X-XSRF-TOKEN": await getCsrfToken() },
            body: JSON.stringify({
                id,
                confirmationCode,
                layoverCount,
                totalPrice,
                username
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
            "There has been a problem with updating the booking:",
            e
        );
    }
    return data;
};

export const deleteBooking = async (id) => {
    const url = `${process.env.REACT_APP_BOOKING_SERVICE_URL}/bookings/${id}`;
    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: { "Authorization": getToken(), "X-XSRF-TOKEN": await getCsrfToken() },
            credentials: 'include'
        });
        if (response.ok === false) {
            throw new Error(
                `Response was not successful. Status code: ${response.status}`
            );
        }
    } catch (e) {
        console.error("There has been a problem with deleting the booking:", e);
    }
};

export const getBookingsByUsername = async (username, index, size) => {
    const url =
        `${process.env.REACT_APP_BOOKING_SERVICE_URL}/bookings/username/` +
        username +
        `?index=${index}&size=${size}`;
    const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json", "Authorization": getToken() }
    });
    const data = await response.json();
    if (data.error) {
        throw new Error(data.error);
    }
    return data;
};
