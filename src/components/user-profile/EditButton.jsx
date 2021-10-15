import React, { useEffect, useState } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';


const EditButton = (props) => {

    const [buttonIsPressed, setButtonIsPressed] = useState(false);

    const handleEdit = () => {
        setButtonIsPressed(true);
        props.onClickEdit();
    }

    const handleCancel = () => {
        setButtonIsPressed(false);
        props.onClickCancel();
    }

    //Once the edit button is pressed, it will turn into a cancel button.
    const getButtonType = () => {
        if (!buttonIsPressed)
            return <Button data-testid="editButton" variant="contained" onClick={handleEdit} color="primary" style={{ maxWidth: 20 }}><EditIcon style={{ maxWidth: 15 }} /></Button>
        else
            return <Button data-testid="cancelButton" variant="contained" color="secondary" onClick={handleCancel} style={{ maxWidth: 20 }}><CancelIcon style={{ maxWidth: 15 }} /></Button>
    }

    return (
        <div>
            {getButtonType()}
        </div>
    );
}

Button.propTypes = {
    onClickEdit: PropTypes.func,
    onClickCancel: PropTypes.func
}

export default EditButton;