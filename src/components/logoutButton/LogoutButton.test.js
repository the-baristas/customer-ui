import React from 'react';
import {render, fireEvent, screen, within, waitFor, waitForElementToBeRemoved} from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../redux/store";
import LogoutButton from "./LogoutButton";

it("Logout button exists", () => {
    const {getByTestId}  = render(<Provider store={store}><LogoutButton></LogoutButton></Provider>);
    const logoutButton = getByTestId('logoutButton');
    expect(logoutButton.innerHTML).toContain('Logout');
})