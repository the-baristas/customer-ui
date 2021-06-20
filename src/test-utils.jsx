import { render as rtlRender } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "./redux/RootReducer";

const render = function render(
    ui,
    {
        initialState,
        store = createStore(rootReducer, initialState),
        ...renderOptions
    } = {}
) {
    const Wrapper = function ({ children }) {
        return <Provider store={store}>{children}</Provider>;
    };
    return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};

// re-export everything
export * from "@testing-library/react";
// override render method
export { render };
