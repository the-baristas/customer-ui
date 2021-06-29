import { fireEvent, render, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { Provider } from "react-redux";
import store from "../../redux/store";
import * as usersService from "../../services/usersService/UsersService";
import UserProfile from "./UserProfile";

let user = { userId: 1, givenName: "First", familyName: "Last",
            username: "username", email: "email@email.com", 
            phone: "8051112222", role: "ROLE_CUSTOMER", active: true }

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

        expect(getByTestId("inputGivenName").value).toBe("First");
        expect(getByTestId("inputFamilyName").value).toBe("Last");
        expect(getByTestId("inputUsername").value).toBe("username");
        expect(getByTestId("inputEmail").value).toBe("email@email.com");
        expect(getByTestId("inputPhone").value).toBe("8051112222");

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

    it("test invalid email and phone number makes error divs display", async () => {
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

        const inputEmail = getByTestId("inputEmail");
        const inputPhone = getByTestId("inputPhone");

        fireEvent.change(inputEmail, { target: { value: "invalidemail" } });
        fireEvent.change(inputPhone, { target: { value: "no" } });

        const errorEmail = getByTestId("divEmailInvalid");
        const errorPhone = getByTestId("divPhoneInvalid");

        expect(errorEmail.innerHTML).toContain("valid email");
        expect(errorPhone.innerHTML).toContain("valid phone");
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

        const form = getByTestId("formRegistration");

        userEvent.click(getByTestId("formRegistration"));
        fireEvent.submit(form);
        await waitForElementToBeRemoved(() => getByTestId("loadingUpdate"));

        expect(error.innerHTML).toEqual("");
        expect(window.alert).toHaveBeenCalled();

        getUserMock.mockClear();
        updateUserMock.mockClear();
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

        const form = getByTestId("formRegistration");

        userEvent.click(getByTestId("formRegistration"));
        fireEvent.submit(form);
        await waitForElementToBeRemoved(() => getByTestId("loadingUpdate"));
        expect(error.innerHTML).toContain("a problem");

        window.alert.mockClear();
        getUserMock.mockClear();
        updateUserMock.mockClear();
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

        const form = getByTestId("formRegistration");

        userEvent.click(getByTestId("formRegistration"));
        fireEvent.submit(form);
        await waitForElementToBeRemoved(() => getByTestId("loadingUpdate"));
        expect(error.innerHTML).toEqual("Error message");

        getUserMock.mockClear();
        updateUserMock.mockClear();
    })
})

