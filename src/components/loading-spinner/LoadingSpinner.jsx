import React from "react";
import Spinner from "react-bootstrap/Spinner";
import { usePromiseTracker } from "react-promise-tracker";
import "./LoadingSpinner.css";

export const LoadingSpinner = (props) => {
    const { promiseInProgress } = usePromiseTracker();

    return (
        promiseInProgress && (
            <div className="spinner">
                <Spinner animation="border" role="status" />
            </div>
        )
    );
};
