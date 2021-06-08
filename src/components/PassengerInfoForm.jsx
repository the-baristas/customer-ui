import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const PassengerInfoForm = () => {
    return (
        <div>
            <Form>
                <Form.Group>
                    <Form.Label>Confirmation Code</Form.Label>
                    <Form.Control></Form.Control>
                    <Form.Label>Layover Count</Form.Label>
                    <Form.Control></Form.Control>
                    <Form.Label>Total Price</Form.Label>
                    <Form.Control></Form.Control>
                    <Form.Label>Username</Form.Label>
                    <Form.Control></Form.Control>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Purchase
                </Button>
            </Form>
        </div>
    );
};

export default PassengerInfoForm;
