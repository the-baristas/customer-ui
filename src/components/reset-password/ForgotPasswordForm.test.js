import React from 'react';
import {render, fireEvent, screen, waitForElementToBeRemoved} from "@testing-library/react";
import userEvent from "@testing-library/user-event"

import { MemoryRouter } from 'react-router-dom';
import * as usersService from '../../api/UsersService';
import ResetPasswordForm from './ResetPasswordForm';
import ForgotPasswordForm from './ForgotPasswordForm';

it("check invalid email makes error divs display", () => {

    const {getByTestId}  = render(<ForgotPasswordForm></ForgotPasswordForm>);
    const inputEmail = getByTestId("inputEmail");

    fireEvent.change(inputEmail, {target: {value: 'invalidemail'}})

    const errorEmail = getByTestId('divEmailInvalid');

    expect(errorEmail.innerHTML).toContain('valid email');

})


it("check submit button makes fetch requests; success", async () => {
    const {getByTestId}  = render(<MemoryRouter><ForgotPasswordForm></ForgotPasswordForm></MemoryRouter>);

    const createResetPasswordRequestMock = jest.spyOn(usersService, 'createResetPasswordRequest');
    createResetPasswordRequestMock.mockResolvedValue({ok: true, status: 200});

    const form = getByTestId("formForgotPassword");

    userEvent.click(
        screen.getByTestId("formForgotPassword")
    )
    fireEvent.submit(form);
    await waitForElementToBeRemoved( () => screen.getByTestId('processing') );

    const success = getByTestId("successMessage");
    expect(success.innerHTML).toContain("email has been sent");

    createResetPasswordRequestMock.mockRestore();
})

it("check submit button makes fetch requests; error response with message", async () => {

    const {getByTestId}  = render(<MemoryRouter><ForgotPasswordForm></ForgotPasswordForm></MemoryRouter>);

    const createResetPasswordRequestMock = jest.spyOn(usersService, 'createResetPasswordRequest');
    createResetPasswordRequestMock.mockResolvedValue({ok: false, status: 403, json: () => {return Promise.resolve({message: "an error message"})}})

    const form = getByTestId("formForgotPassword");
    const error = getByTestId("divError");

    expect(error.innerHTML).toEqual('');

    userEvent.click(
        screen.getByTestId("formForgotPassword")
    )
    fireEvent.submit(form);
    await waitForElementToBeRemoved( () => screen.getByTestId('processing') );
    expect(error.innerHTML).toContain("an error message");

    createResetPasswordRequestMock.mockRestore();
})