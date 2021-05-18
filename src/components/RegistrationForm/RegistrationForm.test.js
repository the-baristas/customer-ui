import {render, fireEvent} from "@testing-library/react";
import RegistrationForm from "./RegistrationForm";



describe("click register button", () => {
    it("check register button render", () => {
        const {queryByTitle} = render(<RegistrationForm></RegistrationForm>);
        const button = queryByTitle("registerButton");
        expect(button).toBeTruthy();
    })
})