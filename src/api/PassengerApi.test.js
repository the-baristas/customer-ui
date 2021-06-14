import { createPassenger } from "./PassengerApi";

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