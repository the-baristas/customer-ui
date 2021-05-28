import {render, fireEvent, screen, within, waitFor, waitForElementToBeRemoved} from "@testing-library/react";
import userEvent from "@testing-library/user-event"
import LoginForm from "./LoginForm";
import {rest} from "msw";
import {setupServer} from "msw/node";
import { Provider } from "react-redux";
import store from "../../redux/store";

    const serverBadCredentials = setupServer(rest.post('http://localhost:8080/users', (req, resp, ctx) => {
    return resp(ctx.status(403), ctx.json( { message: 'nope' }));
    }))


   it("invalid login credentials makes error message appear", async () => {
        serverBadCredentials.listen()
        const {getByTestId} = render(<Provider store={store}><LoginForm></LoginForm></Provider>);
        const form = getByTestId("formLogin");
        const error = getByTestId("divError");
    
        expect(error.innerHTML).toEqual('');
    
        userEvent.click(
            screen.getByTestId("formLogin")
        )
    
        fireEvent.submit(form);
        await waitForElementToBeRemoved( () => screen.getByTestId('processing') );
        expect(error.innerHTML).toEqual('Username and/or password are incorrect.');
    
        serverBadCredentials.close()
        serverBadCredentials.resetHandlers()
    })

it("Login button exists", () => {
    const {getByTestId} = render(<Provider store={store}><LoginForm></LoginForm></Provider>);
    const button = getByTestId("loginButton");
    expect(button).toBeTruthy();
    expect(button.innerHTML).toContain("Login");
})

it("check register form input fields are all blank at start", () => {
    const {getByTestId}  = render(<Provider store={store}><LoginForm></LoginForm></Provider>);
    const inputUsername = getByTestId("inputUsername");
    const inputPassword = getByTestId("inputPassword");
    
    expect(inputUsername.value).toBe('');
    expect(inputPassword.value).toBe('');

    fireEvent.change(inputUsername, {target: {value: 'username'}})
    fireEvent.change(inputPassword, {target: {value: 'password'}})

    expect(inputUsername.value).toBe('username');
    expect(inputPassword.value).toBe('password');
})