import { getToken } from "../utils/Login";

export async function createPayment(clientSecret, bookingId) {
    let response;
    let data;
    try {
        response = await fetch(
            process.env.REACT_APP_BOOKING_SERVICE_URL + "/payments",
            {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": getToken() },
                body: JSON.stringify({
                    stripeId: clientSecret,
                    bookingId: bookingId,
                    refunded: false
                }) 
            }
        );
        if (response.ok === false) {
            throw new Error(
                `Response was not successful. Status code: ${response.status}`
            );
        }
        data = await response.json();
    } catch (e) {
        throw new Error(
            "There has been a problem while creating the payment.",
            e
        );
    }
    return data;
}

export const deletePayment = async (stripeId) => {
    let response;
    try {
        response = await fetch(
            `${process.env.REACT_APP_BOOKING_SERVICE_URL}/payments/${stripeId}`,
            {
                method: "DELETE",
                headers: { "Content-Type": "application/json", "Authorization": getToken() }
            }
        );
        if (response.ok === false) {
            throw new Error(
                `Response was not successful. Status code: ${response.status}`
            );
        }
    } catch (e) {
        console.error(
            "There has been a problem while deleting the payment: ",
            e
        );
    }
};
