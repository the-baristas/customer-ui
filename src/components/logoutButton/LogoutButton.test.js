import React from 'react';
import {render, fireEvent, screen, within, waitFor, waitForElementToBeRemoved} from "@testing-library/react";
import { Provider } from "react-redux";
import * as reactRedux from 'react-redux';
import store from "../../redux/store";
import LogoutButton from "./LogoutButton";
import * as loginUtils from '../../utils/Login';
import { MemoryRouter } from 'react-router-dom';

describe("Logout button", () => {
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    //const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
    


    beforeEach(() => {
        useSelectorMock.mockClear()
        //useDispatchMock.mockClear()
        //useHistoryMock.mockClear();
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

