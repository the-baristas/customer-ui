import React from "react";
import Spinner from "react-bootstrap/Spinner";
import { usePromiseTracker } from "react-promise-tracker";
import styles from "./LoadingSpinner.module.css";

export const LoadingSpinner = (props) => {
    const { promiseInProgress } = usePromiseTracker();

    return (
        promiseInProgress && (
            <div className={styles.spinner}>
                <Spinner animation="border" role="status" />
            </div>
        )
    );
};
