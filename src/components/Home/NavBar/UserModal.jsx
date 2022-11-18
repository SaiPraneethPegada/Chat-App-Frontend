import { Box, Modal } from "@mui/material";
import React from "react";

const UserModal = ({ open, modalClose, user }) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "10px",
  };

  return (
    <Modal
      open={open}
      onClose={modalClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div className="text-center">
          <div>
            <img
              src={user?.pic}
              alt={user?.userName}
              width="350px"
              height="350px"
              className=" mb-3"
            />
          </div>
          <h3>{user?.userName}</h3>
          <div>{user?.email}</div>
        </div>
      </Box>
    </Modal>
  );
};

export default UserModal;
