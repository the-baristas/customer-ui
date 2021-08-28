import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render } from "../../test-utils";
import Booking from "./Booking";

it("renders main image", async () => {

    const pricePerPassenger = 1.00;
    render(
        <MemoryRouter>
            <Booking 
                pricePerPassenger={pricePerPassenger} />
        </MemoryRouter>,
        {
            initialState: {
                userStatus: { userLoggedIn: true, username: "Username" }
            }
        }
    );
});
