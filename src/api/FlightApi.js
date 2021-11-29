import { getToken } from "../utils/Login";

export const searchTrips = async (origin, destination, pageNo, pageSize, sortBy, date, filter, lowerBound = new Date(Date.now()), upperBound = new Date(Date.now())) => {

    let response;
    try {
        const url = `${process.env.REACT_APP_FLIGHT_SERVICE_URL}/flights/new-search?originId=${origin}&destinationId=${destination}&pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}`;
        response = await fetch(url,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: getToken()
                },
                body: JSON.stringify({
                    month: date.getMonth() + 1,
                    date: date.getDate(),
                    year: date.getFullYear(),
                    hours: "00",
                    mins: "00",
                    filter: filter,
                    departureDay: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0,0,0),
                    lowerBound: new Date(Date.UTC(lowerBound.getFullYear(), lowerBound.getMonth(), lowerBound.getDate(), lowerBound.getHours(), lowerBound.getMinutes(), lowerBound.getSeconds())),
                    upperBound: new Date(Date.UTC(upperBound.getFullYear(), upperBound.getMonth(), upperBound.getDate(), upperBound.getHours(), upperBound.getMinutes(), upperBound.getSeconds())),
                })
            }
        )
        if(!response.ok) {
            throw new Error(
                `Response was not successful. Status code: ${response.status}`
            );
        }
    } catch (e) {
        console.error("There has been a problem with your fetch operation:", e);
        response = {};
    }
    return response;
}