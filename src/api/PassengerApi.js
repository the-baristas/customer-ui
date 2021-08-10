import { getToken } from "../utils/Login";

export const createPassenger = async (passengerInfo) => {
    const url = `${process.env.REACT_APP_BOOKING_SERVICE_URL}/passengers`;
    let response;
    let data;
    try {
        response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: getToken()
            },
            body: JSON.stringify(passengerInfo)
        });
        if (response.ok === false) {
            throw new Error(
                `Response was not successful. Status code: ${response.status}`
            );
        }
        data = await response.json();
    } catch (error) {
        throw new Error(
            "There has been a problem with creating the passenger:",
            error
        );
    }
    return data;
};

export const deletePassenger = async (id) => {
    const url = `${process.env.REACT_APP_BOOKING_SERVICE_URL}/passengers/${id}`;
    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: { Authorization: getToken() }
        });
        if (response.ok === false) {
            throw new Error(
                `Response was not successful. Status code: ${response.status}`
            );
        }
    } catch (error) {
        console.error(
            "There has been a problem with deleting the passenger:",
            error
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
    } catch (error) {
        console.error(
            "There has been a problem with searching for passengers:",
            error
        );
    }
    return data;
};
