import { render } from "@testing-library/react";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as reactRedux from 'react-redux';
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import store from "../../redux/store";
import Header from "./Header";

// anthony
it("Login button exists", () => {
    const {getByTestId}  = render(<MemoryRouter><Provider store={store}><Header></Header></Provider></MemoryRouter>);
    const loginButton = getByTestId('loginButton');
    expect(loginButton.innerHTML).toContain('Login');
})

//gabby

describe('test suite', () => {
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');

    beforeEach(() => {
        useSelectorMock.mockClear()
        useDispatchMock.mockClear()
      });

    it('renders logo', () => {
        const root = document.createElement("div");
    
        ReactDOM.render(<Header />, root);
    
        expect(root.querySelector('#logo').textContent).toBe("UTOPIA");
      });

  });
