import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import PassengerInfoForm from "./PassengerInfoForm";
import { Provider } from "react-redux";
import store from "../../redux/store";
import * as usersService from "../../api/UsersService";

it("calls #onPassengerInfoSubmit when all input fields are filled", async () => {
    const handlePassengerInfoSubmit = jest.fn();
    render(
        <Provider store={store}><PassengerInfoForm onPassengerInfoSubmit={handlePassengerInfoSubmit} /></Provider>
    );
    const givenName = "testfirstname";
    userEvent.type(screen.getByLabelText("First Name*"), givenName);
    const familyName = "testlastname";
    userEvent.type(screen.getByLabelText("Last Name*"), familyName);
    const dateOfBirth = "2000-01-01";
    userEvent.type(screen.getByLabelText("Date of Birth*"), dateOfBirth);
    const gender = "other";
    userEvent.selectOptions(screen.getByLabelText("Gender*"), gender);
    const streetAddress = "1 Main Street";
    userEvent.type(screen.getByLabelText("Street Address*"), streetAddress);
    const city = "Townsville";
    userEvent.type(screen.getByLabelText("City*"), city);
    const state = "FL";
    userEvent.type(screen.getByLabelText("State*"), state);
    const zipCode = "12345";
    userEvent.type(screen.getByLabelText("ZIP Code*"), zipCode);
    userEvent.click(screen.getByText("Continue"));

    expect(handlePassengerInfoSubmit).toHaveBeenCalledWith({
        givenName,
        familyName,
        dateOfBirth,
        gender,
        streetAddress,
        city,
        state,
        zipCode
    });
});

it("does not call #onPassengerInfoSubmit when not all input fields are filled", async () => {
    const handlePassengerInfoSubmit = jest.fn();
    render(
        <Provider store={store}><PassengerInfoForm onPassengerInfoSubmit={handlePassengerInfoSubmit} /></Provider>
    );
    const givenName = "testfirstname";
    userEvent.type(screen.getByLabelText("First Name*"), givenName);
    const familyName = "testlastname";
    userEvent.type(screen.getByLabelText("Last Name*"), familyName);
    const dateOfBirth = "2000-01-01";
    userEvent.type(screen.getByLabelText("Date of Birth*"), dateOfBirth);
    const gender = "other";
    userEvent.selectOptions(screen.getByLabelText("Gender*"), gender);
    const streetAddress = "1 Main Street";
    userEvent.type(screen.getByLabelText("Street Address*"), streetAddress);
    const city = "Townsville";
    userEvent.type(screen.getByLabelText("City*"), city);
    const state = "FL";
    userEvent.type(screen.getByLabelText("State*"), state);
    userEvent.click(screen.getByText("Continue"));

    expect(handlePassengerInfoSubmit).toHaveBeenCalledTimes(0);
});

it("Pre-fills form fields with user info", async () => {
    let user = { userId: 1, givenName: "First", familyName: "Last",
            username: "username", email: "email@email.com", 
            phone: "3135556666", dob: "1999-01-01",
            streetAddress: "address", city: "city", state: "CA", zip: "12345",
            role: "ROLE_CUSTOMER", active: true }

    const getUserMock = jest.spyOn(usersService, "getUserByUsername");
    getUserMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => {
            return Promise.resolve(user);
        }
    });

    const handlePassengerInfoSubmit = jest.fn();
    render(
        <Provider store={store}><PassengerInfoForm onPassengerInfoSubmit={handlePassengerInfoSubmit} /></Provider>
    );

    await waitFor(() => expect(getUserMock).toHaveBeenCalled());

    expect(screen.getByLabelText("First Name*").value).toEqual(user.givenName);
    expect(screen.getByLabelText("Last Name*").value).toEqual(user.familyName);
    expect(screen.getByLabelText("Date of Birth*").value).toEqual(user.dob);
    expect(screen.getByLabelText("Street Address*").value).toEqual(user.streetAddress);
    expect(screen.getByLabelText("City*").value).toEqual(user.city);
    expect(screen.getByLabelText("State*").value).toEqual(user.state);
    expect(screen.getByLabelText("ZIP Code*").value).toEqual(user.zip);

})
