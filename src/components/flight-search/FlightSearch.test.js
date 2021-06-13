import {render, fireEvent, screen, within, waitFor, waitForElementToBeRemoved} from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import store from "../../redux/store";
import FlightSearch from "./FlightSearch";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as reactRedux from 'react-redux';

describe('test suite', () => {
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');

    beforeEach(() => {
        useSelectorMock.mockClear()
        useDispatchMock.mockClear()
      });

    it('renders search box', () => {
        const root = document.createElement("div");
    
        ReactDOM.render(<FlightSearch />, root);
    
        expect(root.querySelector('#from-prepend').textContent).toBe("FROM");
      });

      it('renders nav links', () => {
        const root = document.createElement("div");
    
        ReactDOM.render(<FlightSearch />, root);
    
        expect(root.querySelector('#search-submit').textContent).toBe("Search Flights");
      });

  });