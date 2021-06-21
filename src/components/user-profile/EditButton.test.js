import EditButton from "./EditButton";
import React from 'react';
import {render, fireEvent, screen, within, waitFor, waitForElementToBeRemoved} from "@testing-library/react";


describe("EditButton", () => {
    let testEdit = jest.fn();
    let testCancel = jest.fn();

    it("Clicking edit button switches to cancel button and vice-versa", () => {
        const {getByTestId, queryByTestId} = render(<EditButton onClickEdit={testEdit} onClickCancel={testCancel}></EditButton>);
        const edit = getByTestId("editButton");
        
        expect(queryByTestId("cancelButton")).toBeNull();

        fireEvent.click(edit);
        expect(testEdit).toHaveBeenCalled();

        const cancel = getByTestId("cancelButton");
        expect(queryByTestId("editButton")).toBeNull();

        fireEvent.click(cancel);
        expect(testCancel).toHaveBeenCalled();

    })
})