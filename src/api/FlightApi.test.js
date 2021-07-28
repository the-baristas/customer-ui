import { rest } from "msw";
import { setupServer } from "msw/node";
import { searchFlights } from "./FlightApi";

const server = setupServer();

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

it("receives flight data when #searchFlights is successful", async () => {
    const originAirport = "ORI";
    const destinationAirport = "DES";
    const flightData = {
        id: 1,
        airplane: null,
        departureTime: "",
        arrivalTime: "",
        firstReserved: 0,
        firstPrice: 0,
        businessReserved: 0,
        businessPrice: 0,
        economyReserved: 0,
        economyPrice: 0,
        isActive: true,
        route: {
            id: 1,
            originAirport,
            destinationAirport,
            isActive: true
        }
    };
    server.use(
        rest.post(
            `${process.env.REACT_APP_FLIGHT_SERVICE_URL}/flights/query`,
            (req, res, ctx) => {
                return res(ctx.status(201), ctx.json(flightData));
            }
        )
    );

    await expect(
        searchFlights({
            origin: originAirport,
            dest: destinationAirport,
            month: 1,
            date: 1,
            year: 2025,
            hours: 1,
            mins: 0
        })
    ).resolves.toEqual(flightData);
});

it("throws an error when #searchFlights is unsuccessful", async () => {
    server.use(
        rest.post(
            `${process.env.REACT_APP_FLIGHT_SERVICE_URL}/flights/query`,
            (req, res, ctx) => {
                return res(ctx.status(500));
            }
        )
    );

    await expect(
        searchFlights({
            origin: "ORI",
            dest: "DES",
            month: 1,
            date: 1,
            year: 2025,
            hours: 1,
            mins: 0
        })
    ).rejects.toThrow(/There has been a problem with searching flights:/);
});
