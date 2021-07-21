import { fireEvent, render } from "@testing-library/react";
import React from 'react';
import * as reactRedux from 'react-redux';
import { Provider } from "react-redux";
import { MemoryRouter } from 'react-router-dom';
import store from "../../redux/store";
import * as loginUtils from '../../utils/Login';
import LogoutButton from "./LogoutButton";

describe("Logout button", () => {
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    


    beforeEach(() => {
        useSelectorMock.mockClear()
      });

    it("Logout button exists", () => {
        const {getByTestId}  = render(<Provider store={store}><LogoutButton></LogoutButton></Provider>);
        const logoutButton = getByTestId('logoutButton');
        expect(logoutButton.innerHTML).toContain('Logout');
    })

    it("Click logout button calls handleLogout", () => {

        const removeTokenMock = jest.spyOn(loginUtils, 'removeToken');
        const {getByTestId}  = render(<MemoryRouter><Provider store={store}><LogoutButton></LogoutButton></Provider></MemoryRouter>);
        const logoutButton = getByTestId('logoutButton');

        fireEvent.click(logoutButton);
        expect(removeTokenMock).toHaveBeenCalled();

        removeTokenMock.mockRestore();
    })

})

