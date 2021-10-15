import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import './SettingsMenu.css';
import DeleteAccountModal from './DeleteAccountModal';
import { useHistory } from 'react-router';

const SettingsMenu = () => {
  
    let history = useHistory();

    const [anchorEl, setAnchorEl] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const currentPageIs = (urlPath) => {
      return window.location.href.endsWith(urlPath);
  }


    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    }
  
    const handleDelete = () => {
      setAnchorEl(null);
      setDeleteModalOpen(true);
    };

    const handleProfile = () => {
      setAnchorEl(null);
      history.push('/profile')
    };

    const handleHistory = () => {
      setAnchorEl(null);
      history.push("/profile/history")
    };

    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
    }
  
    return (
      <div>
        <Button className="menuButton" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
          Settings
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {!currentPageIs("/profile") && <MenuItem data-testid="menuItemProfile" onClick={handleProfile}>Profile</MenuItem>}
          {!currentPageIs("/profile/history") && <MenuItem data-testid="menuItemHistory" onClick={handleHistory}>Flight History</MenuItem>}
          {<MenuItem data-testid="menuItemDelete" onClick={handleDelete}>Delete Account</MenuItem>}
        </Menu>

        <DeleteAccountModal data-testid="deleteModal" handleClose={() => {handleCloseDeleteModal()}} open={deleteModalOpen} ></DeleteAccountModal>
      </div>
    );
}
 
export default SettingsMenu;