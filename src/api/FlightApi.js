import { getToken } from "../utils/Login";

export const searchFlights = ({
    origin,
    dest,
    newPage = 0,
    pageSize = 10,
    sortBy = "economyPrice",
    month,
    date,
    year,
    hours = 0,
    mins = 0,
    filter = "all"
}) => {
    const url =
        `${process.env.REACT_APP_FLIGHT_SERVICE_URL}/flights/query?` +
        `originId=${origin}&destinationId=${dest}&pageNo=${newPage}&` +
        `pageSize=${pageSize}&sortBy=${sortBy}`;
    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: getToken()
        },
        body: JSON.stringify({
            month,
            date,
            year,
            hours,
            mins,
            filter
        })
    })
        .then((response) => {
            if (response.ok === false) {
                throw new Error(
                    `Response was not successful. Status code: ${response.statusText}`
                );
            }
            return response.json();
        })
        .catch((error) => {
            throw new Error(
                `There has been a problem with searching flights: ${error}`
            );
        });
};
