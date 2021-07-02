import React from 'react';
import {render, fireEvent, screen, waitForElementToBeRemoved} from "@testing-library/react";
import userEvent from "@testing-library/user-event"
import RegistrationForm from "./RegistrationForm";
import {rest} from "msw";
import {setupServer} from "msw/node";
import { MemoryRouter } from 'react-router-dom';
import * as usersService from '../../api/UsersService';





it("check register button makes fetch requests; error response with message", async () => {

    const registerUserMock = jest.spyOn(usersService, 'registerUser');
    registerUserMock.mockResolvedValue({ok: false, status: 403, json: () => {return Promise.resolve({message: "an error message"})}})

    const {getByTestId} = render(<RegistrationForm></RegistrationForm>);
    const form = getByTestId("formRegistration");
    const error = getByTestId("divError");

    expect(error.innerHTML).toEqual('');

    userEvent.click(
        screen.getByTestId("formRegistration")
    )
    fireEvent.submit(form);
    await waitForElementToBeRemoved( () => screen.getByTestId('processing') );
    expect(error.innerHTML).toContain("an error message");

    registerUserMock.mockRestore();
})

it("check register button makes fetch requests; 201 request success", async () => {
    const registerUserMock = jest.spyOn(usersService, 'registerUser');
    registerUserMock.mockResolvedValue({ok: true, status: 201, json: () => {return Promise.resolve("good")}})

    const {getByTestId} = render(<MemoryRouter><RegistrationForm></RegistrationForm></MemoryRouter>);
    const form = getByTestId("formRegistration");
    const error = getByTestId("divError");

    expect(error.innerHTML).toEqual('');

    userEvent.click(
        screen.getByTestId("formRegistration")
    )
    fireEvent.submit(form);
    await waitForElementToBeRemoved( () => screen.getByTestId('processing') );
    expect(error.innerHTML).toEqual('');

    registerUserMock.mockRestore();
})

it("check register button render", () => {
    const {getByTestId} = render(<RegistrationForm></RegistrationForm>);
    const button = getByTestId("registerButton");
    expect(button).toBeTruthy();
    expect(button.innerHTML).toContain("Register");
})

it("check register form input fields are all blank at start", () => {
    const {getByTestId}  = render(<RegistrationForm></RegistrationForm>);
    const inputGivenName = getByTestId("inputGivenName");
    const inputFamilyName = getByTestId("inputFamilyName");
    const inputUsername = getByTestId("inputUsername");
    const inputEmail = getByTestId("inputEmail");
    const inputPhone = getByTestId("inputPhone");
    const inputPassword = getByTestId("inputPassword");
    
    expect(inputGivenName.value).toBe('');
    expect(inputFamilyName.value).toBe('');
    expect(inputUsername.value).toBe('');
    expect(inputEmail.value).toBe('');
    expect(inputPhone.value).toBe('');
    expect(inputPassword.value).toBe('');

    fireEvent.change(inputGivenName, {target: {value: 'First'}})
    fireEvent.change(inputFamilyName, {target: {value: 'Last'}})
    fireEvent.change(inputUsername, {target: {value: 'username'}})
    fireEvent.change(inputEmail, {target: {value: 'email@email.com'}})
    fireEvent.change(inputPhone, {target: {value: '1112223333'}})
    fireEvent.change(inputPassword, {target: {value: 'password'}})

    expect(inputGivenName.value).toBe('First');
    expect(inputFamilyName.value).toBe('Last');
    expect(inputUsername.value).toBe('username');
    expect(inputEmail.value).toBe('email@email.com');
    expect(inputPhone.value).toBe('1112223333');
    expect(inputPassword.value).toBe('password');
})

it("check invalid email, phone, password, and passwordConfirm makes error divs display", () => {

    const {getByTestId}  = render(<RegistrationForm></RegistrationForm>);
    const inputEmail = getByTestId("inputEmail");
    const inputPhone = getByTestId("inputPhone");
    const inputPassword = getByTestId("inputPassword");
    const inputConfirmPassword = getByTestId('inputConfirmPassword')

    fireEvent.change(inputEmail, {target: {value: 'invalidemail'}})
    fireEvent.change(inputPhone, {target: {value: 'no'}})
    fireEvent.change(inputPassword, {target: {value: 'notagoodpassword'}})
    fireEvent.change(inputConfirmPassword, {target: {value: 'nomatch'}})

    const errorEmail = getByTestId('divEmailInvalid');
    const errorPhone = getByTestId('divPhoneInvalid');
    const errorPassword = getByTestId('divPasswordInvalid');
    const errorConfirmPassword = getByTestId('divConfirmPasswordInvalid');

    expect(errorEmail.innerHTML).toContain('valid email');
    expect(errorPhone.innerHTML).toContain('valid phone');
    expect(errorEmail.innerHTML).toContain('valid email');
    expect(errorPassword.innerHTML).toContain('contain at least one');
    expect(errorConfirmPassword.innerHTML).toContain('match');
    

})