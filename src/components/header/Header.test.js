import {render, fireEvent, screen, within, waitFor, waitForElementToBeRemoved} from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import store from "../../redux/store";
import Header from "./Header";

it("Login button exists", () => {
    const {getByTestId}  = render(<MemoryRouter><Provider store={store}><Header></Header></Provider></MemoryRouter>);
    const loginButton = getByTestId('loginButton');
    expect(loginButton.innerHTML).toContain('Login');
})