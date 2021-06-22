import { rest } from "msw";
import { setupServer } from "msw/node";
import { createPassenger } from "./PassengerApi";

const server = setupServer();

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

it("receives passenger data when #createPassenger is successful", async () => {
});

it.todo("throws an error when #createPassenger is unsuccessful");

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
