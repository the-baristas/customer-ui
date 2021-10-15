import { fireEvent, render, waitForElementToBeRemoved, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { Provider } from "react-redux";
import store from "../../redux/store";
import * as usersService from "../../api/UsersService";
import UserProfile from "./UserProfile";
import * as loginService from '../../api/LoginService';

let user = { userId: 1, givenName: "First", familyName: "Last",
            username: "username", email: "email@email.com", 
            phone: "3135556666", dob: "1999-01-01",
            streetAddress: "address", city: "city", state: "CA", zip: "12345",
            role: "ROLE_CUSTOMER", active: true }

describe("UserProfile", () => {
    it("test profile loads", async () => {
        const getUserMock = jest.spyOn(usersService, "getUserByUsername");
        getUserMock.mockResolvedValue({
            ok: true,
            status: 200,
            json: () => {
                return Promise.resolve(user);
            }
        });

        const { getByTestId } = render(
            <Provider store={store}>
                <UserProfile></UserProfile>
            </Provider>
        );
        await waitForElementToBeRemoved(() => getByTestId("loadingProfile"));
        expect(getUserMock).toHaveBeenCalled();

        expect(getByTestId("inputGivenName").value).toBe(user.givenName);
        expect(getByTestId("inputFamilyName").value).toBe(user.familyName);
        expect(getByTestId("inputUsername").value).toBe(user.username);
        expect(getByTestId("inputEmail").value).toBe(user.email);
        expect(getByTestId("inputPhone").value).toBe(user.phone);
        expect(getByTestId("inputDob").value).toBe(user.dob);
        expect(getByTestId("fullAddress").innerHTML).toContain(`${user.streetAddress} ${user.city}, ${user.state} ${user.zip}`)

        getUserMock.mockRestore();
    });

    it("test user profile load fails shows alert error message", async () => {
        window.alert = jest.fn();

        const getUserMock = jest.spyOn(usersService, "getUserByUsername");
        getUserMock.mockResolvedValue({ ok: false, status: 404 });

        const { getByTestId } = render(
            <Provider store={store}>
                <UserProfile></UserProfile>
            </Provider>
        );
        await waitForElementToBeRemoved(() => getByTestId("loadingProfile"));

        expect(getUserMock).toHaveBeenCalled();
        expect(window.alert).toHaveBeenCalled();

        getUserMock.mockRestore();
    });

    it("test update button makes fetch request; no error", async () => {
        window.alert = jest.fn();

        const getUserMock = jest.spyOn(usersService, "getUserByUsername");
        getUserMock.mockResolvedValue({
            ok: true,
            status: 200,
            json: () => {
                return Promise.resolve(user);
            }
        });

        const updateUserMock = jest.spyOn(usersService, "updateUser");
        updateUserMock.mockResolvedValue({ ok: true, status: 200 });

        const loginMock = jest.spyOn(loginService, "userLogin");
        loginMock.mockResolvedValue({ok: true, status: 200, headers: { get: () => {return "token";}}})

        const { getByTestId } = render(
            <Provider store={store}>
                <UserProfile></UserProfile>
            </Provider>
        );

        await waitForElementToBeRemoved(() => getByTestId("loadingProfile"));

        const error = getByTestId("divError");
        expect(error.innerHTML).toEqual("");

        const editButton = getByTestId("editButton");
        userEvent.click(editButton);

        userEvent.type(screen.getByTestId("inputPassword"), "P@ssw0rd");

        const form = getByTestId("formRegistration");

        userEvent.click(getByTestId("formRegistration"));
        fireEvent.submit(form);
        await waitForElementToBeRemoved(() => getByTestId("loadingUpdate"));

        expect(error.innerHTML).toEqual("");
        expect(window.alert).toHaveBeenCalled();

        getUserMock.mockClear();
        updateUserMock.mockClear();
        loginMock.mockClear();
    });

    it("test update button makes fetch request; error responds with generic message", async () => {
        window.alert = jest.fn();
        const getUserMock = jest.spyOn(usersService, "getUserByUsername");
        getUserMock.mockResolvedValue({
            ok: true,
            status: 200,
            json: () => {
                return Promise.resolve(user);
            }
        });

        const updateUserMock = jest.spyOn(usersService, "updateUser");
        updateUserMock.mockResolvedValue({
            ok: false,
            status: 500,
            json: () => {
                return Promise.resolve({});
            }
        });
        const loginMock = jest.spyOn(loginService, "userLogin");
        loginMock.mockResolvedValue({ok: true, status: 200, headers: { get: () => {return "token";}}})
        

        const { getByTestId } = render(
            <Provider store={store}>
                <UserProfile></UserProfile>
            </Provider>
        );
        await waitForElementToBeRemoved(() => getByTestId("loadingProfile"));

        const error = getByTestId("divError");
        expect(error.innerHTML).toEqual("");

        const editButton = getByTestId("editButton");
        userEvent.click(editButton);

        userEvent.type(screen.getByTestId("inputPassword"), "P@ssw0rd");

        const form = getByTestId("formRegistration");

        userEvent.click(getByTestId("formRegistration"));
        fireEvent.submit(form);
        await waitForElementToBeRemoved(() => getByTestId("loadingUpdate"));
        expect(error.innerHTML).toContain("a problem");

        window.alert.mockClear();
        getUserMock.mockClear();
        updateUserMock.mockClear();
        loginMock.mockClear();
    });

    it("test update button makes fetch request; error response with message from fetch response", async () => {
        const getUserMock = jest.spyOn(usersService, 'getUserByUsername');
        getUserMock.mockResolvedValue({ok: true, status: 200, json: () => {return Promise.resolve(user)}})

        const updateUserMock = jest.spyOn(usersService, "updateUser");
        updateUserMock.mockResolvedValue({
            ok: false,
            status: 409,
            json: () => {
                return Promise.resolve({ message: "Error message" });
            }
        });

        const loginMock = jest.spyOn(loginService, "userLogin");
        loginMock.mockResolvedValue({ok: true, status: 200, headers: { get: () => {return "token";}}})

        const { getByTestId } = render(
            <Provider store={store}>
                <UserProfile></UserProfile>
            </Provider>
        );
        await waitForElementToBeRemoved(() => getByTestId("loadingProfile"));

        const error = getByTestId("divError");
        expect(error.innerHTML).toEqual("");

        const editButton = getByTestId("editButton");
        userEvent.click(editButton);

        userEvent.type(screen.getByTestId("inputPassword"), "P@ssw0rd");

        const form = getByTestId("formRegistration");

        userEvent.click(getByTestId("formRegistration"));
        fireEvent.submit(form);
        await waitForElementToBeRemoved(() => getByTestId("loadingUpdate"));
        expect(error.innerHTML).toEqual("Error message");

        getUserMock.mockClear();
        updateUserMock.mockClear();
        loginMock.mockClear();
    })

    it("test update button makes fetch request; incorrect password (login recieves 401)", async () => {
        const getUserMock = jest.spyOn(usersService, 'getUserByUsername');
        getUserMock.mockResolvedValue({ok: true, status: 200, json: () => {return Promise.resolve(user)}})

        const updateUserMock = jest.spyOn(usersService, "updateUser");
        updateUserMock.mockResolvedValue({ ok: true, status: 200 });

        const loginMock = jest.spyOn(loginService, "userLogin");
        loginMock.mockResolvedValue({ok: false, status: 401})

        const { getByTestId } = render(
            <Provider store={store}>
                <UserProfile></UserProfile>
            </Provider>
        );
        await waitForElementToBeRemoved(() => getByTestId("loadingProfile"));

        const error = getByTestId("divError");
        expect(error.innerHTML).toEqual("");

        const editButton = getByTestId("editButton");
        userEvent.click(editButton);

        userEvent.type(screen.getByTestId("inputPassword"), "P@ssw0rd");

        const form = getByTestId("formRegistration");

        userEvent.click(getByTestId("formRegistration"));
        fireEvent.submit(form);
        await waitForElementToBeRemoved(() => getByTestId("loadingUpdate"));
        expect(error.innerHTML).toEqual("Password is incorrect.");

        getUserMock.mockClear();
        updateUserMock.mockClear();
        loginMock.mockClear();
    })
})

