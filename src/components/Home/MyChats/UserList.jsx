import { Avatar, Box } from "@mui/material";
import React from "react";

const UserList = ({ user, accessChat }) => {
  const boxSX = {
    "&:hover": {
      color: "black",
      backgroundColor: "#adb5bd",
      cursor: "pointer",
    },
  };

  return (
    <>
      <Box
        sx={boxSX}
        className="d-flex align-items-center px-3 py-2 mb-2"
        onClick={() => accessChat()}
      >
        <Avatar src={user?.pic} name={user?.userName} />
        <Box className="ms-3">
          <div>{user?.userName}</div>
          <div>
            <b>Email: </b>
            {user?.email}
          </div>
        </Box>
      </Box>
    </>
  );
};

export default UserList;
