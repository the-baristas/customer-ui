import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import PassengerInfoForm from "./PassengerInfoForm";

it("calls #onPassengerInfoSubmit when all input fields are filled", async () => {
    const handlePassengerInfoSubmit = jest.fn();
    render(
        <PassengerInfoForm onPassengerInfoSubmit={handlePassengerInfoSubmit} />
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
        <PassengerInfoForm onPassengerInfoSubmit={handlePassengerInfoSubmit} />
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
