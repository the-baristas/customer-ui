import { createBooking } from "./BookingApi";

it("should fetch booking data after creating a booking", async () => {
    const fakeBooking = {
        confirmationCode: "A1",
        layoverCount: 0,
        username: "user1"
    };
    jest.spyOn(global, "fetch").mockImplementation(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve(fakeBooking)
        })
    );

    const data = await createBooking({
        confirmationCode: "A1",
        layoverCount: 0,
        username: "user1"
    });
    expect(data).toEqual(fakeBooking);
    global.fetch.mockRestore();
});
