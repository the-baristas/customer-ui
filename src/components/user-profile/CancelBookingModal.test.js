import React from 'react';
import { render, fireEvent, waitForElementToBeRemoved } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../redux/store";
import * as bookingService from "../../api/BookingApi";
import CancelBookingModal from './CancelBookingModal';
import { MemoryRouter } from 'react-router-dom';

describe("CancelBookingModal", () => {
    let refundBookingMock;

    let booking = {
        totalPrice: 200,
        id: 1,

    }

    beforeEach(() => {
        refundBookingMock = jest.spyOn(bookingService, "refundBooking");
        refundBookingMock.mockResolvedValue({ ok: true, status: 200 });
    })

    afterEach(() => {
        refundBookingMock.mockRestore();
    })


    it("Delete account request successful", async () => {
        const { getByTestId } = render(<MemoryRouter>
            <CancelBookingModal handleClose={() => {}}
            handleCancelComplete={() => {}}
            open={true}
            booking={booking}></CancelBookingModal>
            </MemoryRouter>);
        const cancelButton = getByTestId("cancelButton");

        fireEvent.click(cancelButton);

        await waitForElementToBeRemoved(() => getByTestId("loading"));

        expect(refundBookingMock).toHaveBeenCalled();
    })

})