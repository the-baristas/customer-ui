import {render, fireEvent, screen, within, waitFor, waitForElementToBeRemoved} from "@testing-library/react";
import userEvent from "@testing-library/user-event"
import RegistrationForm from "./RegistrationForm";
import {rest} from "msw";
import {setupServer} from "msw/node";



const serverOk = setupServer(rest.post('http://localhost:8080/users', (req, resp, ctx) => {
    return resp(ctx.status(200), ctx.json( { payload: 'Would normally return user data'} ));
    }))
const serverBadRequest = setupServer(rest.post('http://localhost:8080/users', (req, resp, ctx) => {
    return resp(ctx.status(409), ctx.json( { message: 'nope' }));
    }))
window.alert = jest.fn();


it("check register button makes fetch requests; error response with message", async () => {
    serverBadRequest.listen()
    const {getByTestId} = render(<RegistrationForm></RegistrationForm>);
    const form = getByTestId("formRegistration");
    const error = getByTestId("divError");

    expect(error.innerHTML).toEqual('');

    userEvent.click(
        screen.getByTestId("formRegistration")
    )
    fireEvent.submit(form);
    await waitForElementToBeRemoved( () => screen.getByTestId('processing') );
    expect(error.innerHTML).toEqual('nope');

    serverBadRequest.close()
    serverBadRequest.resetHandlers()
})

xit("check register button makes fetch requests; 200 request success", async () => {
    window.alert.mockClear();
    serverOk.listen();
    const {getByTestId} = render(<RegistrationForm></RegistrationForm>);
    const form = getByTestId("formRegistration");
    const error = getByTestId("divError");

    expect(error.innerHTML).toEqual('');

    userEvent.click(
        screen.getByTestId("formRegistration")
    )
    fireEvent.submit(form);
    await waitForElementToBeRemoved( () => screen.getByTestId('processing') );
    expect(error.innerHTML).toEqual('');

    serverOk.close();
    serverOk.resetHandlers()
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