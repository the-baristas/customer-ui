import { rest } from "msw";
import { setupServer } from "msw/node";
import { createBooking, deleteBooking, updateBooking } from "./BookingApi";

const server = setupServer();

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

it("receives booking data when #createBooking is successful", async () => {
    const bookingData = {
        id: 1,
        confirmationCode: "A1",
        layoverCount: 0,
        username: "user1"
    };
    const url = `${process.env.REACT_APP_BOOKING_SERVICE_URL}/bookings`;
    server.use(
        rest.post(url, (req, res, ctx) => {
            return res(ctx.status(201), ctx.json(bookingData));
        })
    );

    await expect(
        createBooking({
            confirmationCode: "A1",
            layoverCount: 0,
            username: "user1"
        })
    ).resolves.toEqual(bookingData);
});

it("receives an empty object when #createBooking is unsuccessful", async () => {
    const url = `${process.env.REACT_APP_BOOKING_SERVICE_URL}/bookings`;
    server.use(
        rest.post(url, (req, res, ctx) => {
            return res(ctx.status(500));
        })
    );

    await expect(
        createBooking({
            confirmationCode: "A1",
            layoverCount: 0,
            username: "user1"
        })
    ).resolves.toEqual({});
});

it("receives booking data when #updateBooking is successful", async () => {
    const id = 1;
    const bookingData = {
        id,
        confirmationCode: "A1",
        layoverCount: 0,
        username: "user1"
    };
    const url = `${process.env.REACT_APP_BOOKING_SERVICE_URL}/bookings/${id}`;
    server.use(
        rest.put(url, (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(bookingData));
        })
    );

    await expect(
        updateBooking({
            id,
            confirmationCode: "A1",
            layoverCount: 0,
            username: "user1"
        })
    ).resolves.toEqual(bookingData);
});

it("throws an error when #updateBooking is unsuccessful", async () => {
    const id = 1;
    const url = `${process.env.REACT_APP_BOOKING_SERVICE_URL}/bookings/${id}`;
    server.use(
        rest.put(url, (req, res, ctx) => {
            return res(ctx.status(500));
        })
    );

    await expect(
        updateBooking({
            id,
            confirmationCode: "A1",
            layoverCount: 0,
            username: "user1"
        })
    ).rejects.toThrowError();
});

it("does not throw an error when #deleteBooking is successful", async () => {
    const id = 1;
    const url = `${process.env.REACT_APP_BOOKING_SERVICE_URL}/bookings/${id}`;
    server.use(
        rest.delete(url, (req, res, ctx) => {
            return res(ctx.status(204));
        })
    );

    await expect(deleteBooking(id)).resolves.not.toThrowError();
});

it("does not throw an error when #deleteBooking is unsuccessful", async () => {
    const id = 1;
    const url = `${process.env.REACT_APP_BOOKING_SERVICE_URL}/bookings/${id}`;
    server.use(
        rest.delete(url, (req, res, ctx) => {
            return res(ctx.status(500));
        })
    );

    await expect(deleteBooking(id)).resolves.not.toThrowError();
});