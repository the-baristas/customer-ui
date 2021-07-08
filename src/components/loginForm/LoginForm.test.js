import { fireEvent, render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import React from 'react';
import { Provider } from "react-redux";
import { MemoryRouter } from 'react-router-dom';
import store from "../../redux/store";
import * as loginService from '../../api/LoginService';
import * as loginUtils from '../../utils/Login';
import LoginForm from './LoginForm';


it("Login with valid credentials redirects to home", async () => {
    const loginMock = jest.spyOn(loginService, 'userLogin');
    loginMock.mockResolvedValue({ok: true, status: 200, headers: { get: () => {return "token";}}})

    const saveTokenMock = jest.spyOn(loginUtils, 'saveToken');


    const { getByTestId } = render(<MemoryRouter><Provider store={store}><LoginForm></LoginForm></Provider></MemoryRouter>);
    const form = getByTestId("formLogin");
    const error = getByTestId("divError");

    expect(error.innerHTML).toEqual('');

    fireEvent.submit(form);
    await waitForElementToBeRemoved(() => screen.getByTestId('processing'));
    expect(saveTokenMock).toBeCalledWith("token");

    loginMock.mockRestore();
    saveTokenMock.mockRestore();
})

it("invalid login credentials makes error message appear", async () => {
    const loginMock = jest.spyOn(loginService, 'userLogin');
    loginMock.mockResolvedValue({ok: false, status: 401})

    const { getByTestId } = render(<MemoryRouter><Provider store={store}><LoginForm></LoginForm></Provider></MemoryRouter>);
    const form = getByTestId("formLogin");
    const error = getByTestId("divError");

    expect(error.innerHTML).toEqual('');

    fireEvent.submit(form);
    await waitForElementToBeRemoved(() => screen.getByTestId('processing'));
    expect(error.innerHTML).toContain('incorrect');

    loginMock.mockRestore();
})

it("error besides 403 makes error message appear", async () => {
    const loginMock = jest.spyOn(loginService, 'userLogin');
    loginMock.mockResolvedValue({ok: false, status: 500})

    const { getByTestId } = render(<MemoryRouter><Provider store={store}><LoginForm></LoginForm></Provider></MemoryRouter>);
    const form = getByTestId("formLogin");
    const error = getByTestId("divError");

    expect(error.innerHTML).toEqual('');

    fireEvent.submit(form);
    await waitForElementToBeRemoved(() => screen.getByTestId('processing'));
    expect(error.innerHTML).toContain('problem');

    loginMock.mockRestore();
})

it("Login button exists", () => {
    const { getByTestId } = render(<Provider store={store}><LoginForm></LoginForm></Provider>);
    const button = getByTestId("loginButton");
    expect(button).toBeTruthy();
    expect(button.innerHTML).toContain("Login");
})

it("check register form input fields are all blank at start", () => {
    const { getByTestId } = render(<Provider store={store}><LoginForm></LoginForm></Provider>);
    const inputUsername = getByTestId("inputUsername");
    const inputPassword = getByTestId("inputPassword");

    expect(inputUsername.value).toBe('');
    expect(inputPassword.value).toBe('');

    fireEvent.change(inputUsername, { target: { value: 'username' } })
    fireEvent.change(inputPassword, { target: { value: 'password' } })

    expect(inputUsername.value).toBe('username');
    expect(inputPassword.value).toBe('password');
})