import React from 'react';
import { render, fireEvent, waitForElementToBeRemoved } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../redux/store";
import * as loginService from '../../api/LoginService';
import * as usersService from "../../api/UsersService";
import DeleteAccountModal from './DeleteAccountModal';
import { MemoryRouter } from 'react-router-dom';

describe("DeleteAccountModal", () => {
    let loginMock;
    let deleteUserMock;
    beforeEach(() => {
        loginMock = jest.spyOn(loginService, 'userLogin');
        loginMock.mockResolvedValue({ ok: true, status: 200 })

        deleteUserMock = jest.spyOn(usersService, "deleteUserAccount");
        deleteUserMock.mockResolvedValue({ ok: true, status: 204 });
    })

    afterEach(() => {
        loginMock.mockRestore();
        deleteUserMock.mockRestore();
    })


    it("Delete account request successful", async () => {
        const { getByTestId } = render(<MemoryRouter><Provider store={store}>
            <DeleteAccountModal open={true}></DeleteAccountModal>
        </Provider></MemoryRouter>);
        const deleteButton = getByTestId("deleteButton");
        const error = getByTestId("divError");
        const passwordInput = getByTestId("inputPassword");

        fireEvent.change(passwordInput, {target: {value: 'pass'}})

        fireEvent.click(deleteButton);

        await waitForElementToBeRemoved(() => getByTestId("loading"));

        expect(loginMock).toHaveBeenCalled();
        expect(deleteUserMock).toHaveBeenCalled();
        expect(error.innerHTML).toEqual('');
    })

    it("Delete account request unsuccessful; password verification request fails and shows error message.", async () => {
        loginMock.mockResolvedValue({ ok: false, status: 401 })

        const { getByTestId } = render(<MemoryRouter><Provider store={store}>
            <DeleteAccountModal open={true}></DeleteAccountModal>
        </Provider></MemoryRouter>);
        const deleteButton = getByTestId("deleteButton");
        const error = getByTestId("divError");
        const passwordInput = getByTestId("inputPassword");

        fireEvent.change(passwordInput, {target: {value: 'pass'}})

        fireEvent.click(deleteButton);

        await waitForElementToBeRemoved(() => getByTestId("loading"));

        expect(loginMock).toHaveBeenCalled();
        expect(error.innerHTML).toContain('incorrect');
    })

    it("Delete account request unsuccessful; password verification request fails and shows error message.", async () => {
        deleteUserMock.mockResolvedValue({ ok: false, status: 500 });

        const { getByTestId } = render(<MemoryRouter><Provider store={store}>
            <DeleteAccountModal open={true}></DeleteAccountModal>
        </Provider></MemoryRouter>);
        const deleteButton = getByTestId("deleteButton");
        const error = getByTestId("divError");
        const passwordInput = getByTestId("inputPassword");

        fireEvent.change(passwordInput, {target: {value: 'pass'}})

        fireEvent.click(deleteButton);

        await waitForElementToBeRemoved(() => getByTestId("loading"));

        expect(loginMock).toHaveBeenCalled();
        expect(error.innerHTML).toContain('a problem');
    })
})