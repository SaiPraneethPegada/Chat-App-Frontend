import React from "react";
import Box from "@mui/material/Box";

import NavBar from "./Home/NavBar/NavBar";
import MyChats from "./Home/MyChats/MyChats";
import ChatBox from "./Home/ChatBox/ChatBox";

const HomePage = () => {
  return (
    <div className="w-100 h-100">
      <NavBar />
      <Box
        className="d-flex justify-content-between w-100 chatPage_wrapper"
        style={{ height: "91.5vh" }}
      >
        <MyChats />
        <ChatBox />
      </Box>
    </div>
  );
};

export default HomePage;
