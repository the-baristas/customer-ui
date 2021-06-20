import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "../../test-utils";
import Home from "./Home";

it("renders welcome text if logged in and renders main image", async () => {
    render(
        <MemoryRouter>
            <Home />
        </MemoryRouter>,
        {
            initialState: {
                userStatus: { userLoggedIn: true, username: "Username" }
            }
        }
    );
    screen.debug();

    expect(
        screen.getByRole("heading", { name: "Welcome Username" })
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "main image" })).toBeInTheDocument();
});
