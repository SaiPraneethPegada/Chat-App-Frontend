import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { Logout } from "@mui/icons-material";
import decode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Bell from "../../../assets/Bell.svg";
import { ChatState } from "../../../context/ChatProvider";
import { getSender } from "../../../helpers/ChatLogics";
import Search from "../../../assets/Search.svg";
import SideBar from "../MyChats/SideBar";
import UserModal from "./UserModal";

const paperPropsStyle = {
  elevation: 0,
  sx: {
    overflow: "visible",
    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
    mt: 1.5,
    "& .MuiAvatar-root": {
      width: 32,
      height: 32,
      ml: -0.5,
      mr: 1,
    },
    "&:before": {
      content: '""',
      display: "block",
      position: "absolute",
      top: 0,
      right: 14,
      width: 10,
      height: 10,
      bgcolor: "background.paper",
      transform: "translateY(-50%) rotate(45deg)",
      zIndex: 0,
    },
  },
};

const NavBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [open, setOpen] = React.useState(false);

  const openProfile = Boolean(anchorEl);
  const openNotification = Boolean(notificationAnchorEl);

  const navigate = useNavigate();
  const {
    setSelectedChat,
    user,
    toggleLeft,
    toggleDrawer,
    notification,
    setNotification,
    chatOpened,
  } = ChatState();

  const handleModal = () => setOpen(true);
  const modalClose = () => setOpen(false);

  const handleProfile = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleNotification = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };
  const closeProfile = () => {
    setAnchorEl(null);
  };
  const closeNotification = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    if (user) {
      const decodeToken = decode(user?.token);
      if (Math.round(+new Date() / 1000) > decodeToken.exp) {
        handleLogout();
        alert("Session Expired! Please Login to continue");
      }
    }
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    if (user && chatOpened) {
      notification.map((msg) => {
        return setNotification(
          notification.filter((n) => n.sender._id !== msg.sender._id)
        );
      });
    }
    // eslint-disable-next-line
  }, [chatOpened]);

  return (
    <>
      <Box className="d-flex justify-content-between shadow p-1 align-items-center rounded-4">
        <div className="ms-3">
          <Tooltip title="Search users">
            <Button onClick={() => toggleDrawer(toggleLeft)}>
              <img src={Search} alt="search icon" />
              <div className="display_none ms-3">My Chats</div>
            </Button>
          </Tooltip>
        </div>
        <h2 className="hide_heading">Chat App</h2>
        <div className="d-flex align-items-center">
          <IconButton
            size="small"
            sx={{ ml: 2 }}
            aria-controls={openNotification ? "new-notification" : undefined}
            aria-haspopup="true"
            aria-expanded={openNotification ? "true" : undefined}
            onClick={handleNotification}
            className="me-2"
          >
            <Badge
              badgeContent={notification?.length}
              color="primary"
              style={{ cursor: "pointer" }}
            >
              <img src={Bell} alt="Bell icon" />
            </Badge>
          </IconButton>

          <Menu
            anchorEl={notificationAnchorEl}
            id="new-notification"
            open={openNotification}
            onClose={closeNotification}
            onClick={closeNotification}
            PaperProps={paperPropsStyle}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            className="d-flex flex-column justify-content-center"
          >
            {!notification.length ? (
              <MenuItem className="m-2">No new messages</MenuItem>
            ) : (
              <div>
                {notification?.map((msg) => (
                  <MenuItem
                    className="m-2"
                    key={msg._id}
                    onClick={() => {
                      setSelectedChat(msg.chat);
                      setNotification(notification.filter((n) => n !== msg));
                    }}
                  >
                    New message from {getSender(user, msg?.chat.users)}
                  </MenuItem>
                ))}
              </div>
            )}
            <div className="me-2 d-flex justify-content-end">
              {!notification.length ? (
                ""
              ) : (
                <Button onClick={() => setNotification([])}>Clear All</Button>
              )}
            </div>
          </Menu>

          <Tooltip title="Account details" className="me-4">
            <IconButton
              onClick={handleProfile}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={openProfile ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openProfile ? "true" : undefined}
              className="me-2"
            >
              <Avatar src={user?.pic} alt={user?.userName} />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={openProfile}
            onClose={closeProfile}
            onClick={closeProfile}
            PaperProps={paperPropsStyle}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={() => handleModal()}>
              <Avatar>{user?.userName.split("")[0]}</Avatar> Profile
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => handleLogout()}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </div>
      </Box>
      <UserModal open={open} modalClose={modalClose} user={user} />

      <SideBar />
    </>
  );
};

export default NavBar;
