import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "../../test-utils";
import Booking from "./Booking";

it("renders main image", async () => {
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
    expect(screen.getByRole("img", { name: "main image" })).toBeInTheDocument();
});
