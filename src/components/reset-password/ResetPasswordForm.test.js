import React from 'react';
import {render, fireEvent, screen, waitForElementToBeRemoved} from "@testing-library/react";
import userEvent from "@testing-library/user-event"

import { MemoryRouter } from 'react-router-dom';
import * as usersService from '../../api/UsersService';
import ResetPasswordForm from './ResetPasswordForm';

it("check invalid password and passwordConfirm makes error divs display", () => {
    jest.mock('react-router-dom', () => ({
        ...jest.requireActual('react-router-dom'),
        useParams: jest.fn().mockReturnValue("token"),
      }))

    const {getByTestId}  = render(<MemoryRouter><ResetPasswordForm></ResetPasswordForm></MemoryRouter>);
    const inputPassword = getByTestId("inputPassword");
    const inputConfirmPassword = getByTestId('inputConfirmPassword')

    fireEvent.change(inputPassword, {target: {value: 'notagoodpassword'}})
    fireEvent.change(inputConfirmPassword, {target: {value: 'nomatch'}})

    const errorPassword = getByTestId('divPasswordInvalid');
    const errorConfirmPassword = getByTestId('divConfirmPasswordInvalid');

    expect(errorPassword.innerHTML).toContain('contain at least one');
    expect(errorConfirmPassword.innerHTML).toContain('match');
})

it("check submit button makes fetch requests; success", async () => {
    jest.mock('react-router-dom', () => ({
        ...jest.requireActual('react-router-dom'),
        useParams: jest.fn().mockReturnValue("token"),
      }))

    const {getByTestId}  = render(<MemoryRouter><ResetPasswordForm></ResetPasswordForm></MemoryRouter>);

    const resetPasswordMock = jest.spyOn(usersService, 'resetPassword');
    resetPasswordMock.mockResolvedValue({ok: true, status: 200});

    const form = getByTestId("formResetPassword");

    userEvent.click(
        screen.getByTestId("formResetPassword")
    )
    fireEvent.submit(form);
    await waitForElementToBeRemoved( () => screen.getByTestId('processing') );

    const success = getByTestId("successMessage");
    expect(success.innerHTML).toContain("successfully");

    resetPasswordMock.mockRestore();
})

it("check submit button makes fetch requests; error response with message", async () => {
    jest.mock('react-router-dom', () => ({
        ...jest.requireActual('react-router-dom'),
        useParams: jest.fn().mockReturnValue("token"),
      }))

    const {getByTestId}  = render(<MemoryRouter><ResetPasswordForm></ResetPasswordForm></MemoryRouter>);

    const resetPasswordMock = jest.spyOn(usersService, 'resetPassword');
    resetPasswordMock.mockResolvedValue({ok: false, status: 403, json: () => {return Promise.resolve({message: "an error message"})}})

    const form = getByTestId("formResetPassword");
    const error = getByTestId("divError");

    expect(error.innerHTML).toEqual('');

    userEvent.click(
        screen.getByTestId("formResetPassword")
    )
    fireEvent.submit(form);
    await waitForElementToBeRemoved( () => screen.getByTestId('processing') );
    expect(error.innerHTML).toContain("an error message");

    resetPasswordMock.mockRestore();
})