import React from 'react';
import {render, fireEvent, screen, within, waitFor, waitForElementToBeRemoved} from "@testing-library/react";
import SettingsMenu from "./SettingsMenu";
import { Provider } from "react-redux";
import store from "../../redux/store";

describe("SettingsMenu", () => {
    it("Clicking Delete Account opens modal", () => {
        const {getByTestId, queryByTestId} = render(<Provider store={store}><SettingsMenu></SettingsMenu></Provider>);
        const menuItem = getByTestId("menuItemDelete");

        expect(menuItem.innerHTML).toContain("Delete");

        expect(queryByTestId("deleteModal")).toBeNull();

        fireEvent.click(menuItem);

        expect(queryByTestId("deleteModal")).toBeDefined();



    })
})