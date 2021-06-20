import { render } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import store from "../../redux/store";
import UserProfile from "./UserProfile";

let user = {
    userId: 1,
    givenName: "First",
    familyName: "Last",
    username: "username",
    email: "email@email.com",
    phone: "8056744000",
    role: "ROLE_CUSTOMER",
    active: true
};

describe("charles test", () => {
    const mockJson = jest.fn().mockReturnValue(user);
    jest.mock("../../services/usersService/UsersService", () => {
        return {
            getUserByUsername: jest.fn(async () => {
                return {
                    ok: true,
                    json: mockJson
                };
            })
        };
    });
    jest.mock("react-redux", () => {
        return {
            useSelector: jest.fn().mockReturnValue({ username: "username" })
        };
    });

    it("test", async () => {
        render(
            <Provider store={store}>
                <UserProfile></UserProfile>
            </Provider>
        );
    });
});

// xit("check profile loads", async () => {
//     const { getByTestId } = render(
//         <Provider store={store}>
//             <UserProfile></UserProfile>
//         </Provider>
//     );
//     await waitForElementToBeRemoved(() => screen.getByTestId("loading"));
//     expect(getUserByUsername).toHaveBeenCalled();

//     const givenNameField = screen.getByTestId("givenName");
//     expect(givenNameField.innerHTML).toContain(user.givenName);
// });
