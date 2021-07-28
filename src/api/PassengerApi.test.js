import { rest } from "msw";
import { setupServer } from "msw/node";
import {
    createPassenger,
    deletePassenger,
    searchPassengers
} from "./PassengerApi";

const server = setupServer();

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

it("receives passenger data when #createPassenger is successful", async () => {
    const passengerData = {
        id: 0,
        givenName: "givenName",
        familyName: "familyName",
        dateOfBirth: "2000-01-01",
        gender: "other",
        streetAddress: "1 Main Street",
        city: "Test City",
        state: "FL",
        zipCode: "12345"
    };
    const url = `${process.env.REACT_APP_BOOKING_SERVICE_URL}/passengers`;
    server.use(
        rest.post(url, (req, res, ctx) => {
            return res(ctx.status(201), ctx.json(passengerData));
        })
    );

    await expect(
        createPassenger({
            bookingConfirmationCode: "A1",
            originAirportCode: "ABC",
            destinationAirportCode: "BCD",
            airplaneModel: "model",
            departureTime: "10/10/2021 01:00",
            arrivalTime: "10/10/2021 02:00",
            givenName: "givenName",
            familyName: "familyName",
            dateOfBirth: "2000-01-01",
            gender: "other",
            address: "1 Main Street Test City, FL 12345",
            seatClass: "first",
            seatNumber: "1",
            checkInGroup: "1"
        })
    ).resolves.toEqual(passengerData);
});

it("throws an error when #createPassenger is unsuccessful", async () => {
    const url = `${process.env.REACT_APP_BOOKING_SERVICE_URL}/passengers`;
    server.use(
        rest.post(url, (req, res, ctx) => {
            return res(ctx.status(500));
        })
    );

    await expect(
        createPassenger({
            bookingConfirmationCode: "A1",
            originAirportCode: "ABC",
            destinationAirportCode: "BCD",
            airplaneModel: "model",
            departureTime: "10/10/2021 01:00",
            arrivalTime: "10/10/2021 02:00",
            givenName: "givenName",
            familyName: "familyName",
            dateOfBirth: "2000-01-01",
            gender: "other",
            address: "1 Main Street Test City, FL 12345",
            seatClass: "first",
            seatNumber: "1",
            checkInGroup: "1"
        })
    ).rejects.toThrowError(
        /There has been a problem with creating the passenger:/
    );
});

it("does not throw an error when #deletePassenger is successful", async () => {
    const id = 1;
    const url = `${process.env.REACT_APP_BOOKING_SERVICE_URL}/passengers/${id}`;
    server.use(
        rest.delete(url, (req, res, ctx) => {
            return res(ctx.status(204));
        })
    );

    await expect(deletePassenger(id)).resolves.not.toThrowError();
});

it("does not throw an error when #deletePassenger is unsuccessful", async () => {
    const id = 1;
    const url = `${process.env.REACT_APP_BOOKING_SERVICE_URL}/passengers/${id}`;
    server.use(
        rest.delete(url, (req, res, ctx) => {
            return res(ctx.status(500));
        })
    );

    await expect(deletePassenger(id)).resolves.not.toThrowError();
});

it("receives list of passenger data when #searchPassengers is successful", async () => {
    const passengersData = [
        {
            id: 0,
            givenName: "givenName",
            familyName: "familyName",
            dateOfBirth: "2000-01-01",
            gender: "other",
            streetAddress: "1 Main Street",
            city: "Test City",
            state: "FL",
            zipCode: "12345"
        }
    ];
    const searchTerm = "searchTerm";
    const index = 0;
    const size = 1;
    const url =
        `${process.env.REACT_APP_BOOKING_SERVICE_URL}/passengers/search?` +
        `term=${searchTerm}&index=${index}&size=${size}`;
    server.use(
        rest.get(url, (req, res, ctx) => {
            return res(ctx.status(201), ctx.json(passengersData));
        })
    );

    await expect(searchPassengers(searchTerm, index, size)).resolves.toEqual(
        passengersData
    );
});

it("does not throw an error when #searchPassengers is unsuccessful", async () => {
    const passengersData = [
        {
            id: 0,
            givenName: "givenName",
            familyName: "familyName",
            dateOfBirth: "2000-01-01",
            gender: "other",
            streetAddress: "1 Main Street",
            city: "Test City",
            state: "FL",
            zipCode: "12345"
        }
    ];
    const searchTerm = "searchTerm";
    const index = 0;
    const size = 1;
    const url =
        `${process.env.REACT_APP_BOOKING_SERVICE_URL}/passengers/search?` +
        `term=${searchTerm}&index=${index}&size=${size}`;
    server.use(
        rest.get(url, (req, res, ctx) => {
            return res(ctx.status(500), ctx.json(passengersData));
        })
    );

    await expect(
        searchPassengers(searchTerm, index, size)
    ).resolves.not.toThrowError();
});

it("should fetch passenger data after creating a booking", async () => {
    const fakePassenger = {};
    jest.spyOn(global, "fetch").mockImplementation(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve(fakePassenger)
        })
    );

    const data = await createPassenger({});
    expect(data).toEqual(fakePassenger);
    global.fetch.mockRestore();
});
