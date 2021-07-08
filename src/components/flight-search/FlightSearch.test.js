import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as reactRedux from 'react-redux';
import FlightSearch from "./FlightSearch";

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