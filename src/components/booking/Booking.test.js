import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render } from "../../test-utils";
import Booking from "./Booking";

it("renders welcome text if logged in and renders main image", async () => {
    render(
        <MemoryRouter>
            <Booking />
        </MemoryRouter>,
        {
            initialState: {
                userStatus: { userLoggedIn: true, username: "Username" }
            }
        }
    );
});
