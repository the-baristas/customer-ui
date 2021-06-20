import { render, screen } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import store from "../../redux/store";
import Home from "./Home";

it("test", async () => {
    render(
        <Provider store={store}>
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        </Provider>
    );
    screen.debug();
});
