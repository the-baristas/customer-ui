export async function createPayment(clientSecret, bookingId)
{
    return fetch(process.env.REACT_APP_BOOKING_SERVICE_URL + "/payments", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stripeId: clientSecret, bookingId: bookingId, refunded: false})
    })
}