import axios from "axios";
import { Box } from "@mui/material";
import React, { useEffect } from "react";

import { API_URL } from "../../../App";
import { ChatState } from "../../../context/ChatProvider";
import ChatList from "./ChatList";

const MyChats = () => {
  let loggedUser = JSON.parse(sessionStorage.getItem("userInfo"));

  const { chats, setChats, messages, setToggleLeft, notification } =
    ChatState();

  const fetchChats = async () => {
    try {
      const res = await axios.get(`${API_URL}/chat/`, {
        headers: {
          Authorization: `Bearer ${loggedUser?.token}`,
        },
      });
      setChats(res.data);
      setToggleLeft(false);
    } catch (error) {
      alert(error);
    }
  };

  // console.log(chats);

  useEffect(() => {
    fetchChats();
    // eslint-disable-next-line
  }, [messages, notification]);

  return (
    <Box className="p-3 shadow myChats_wrapper m-1 rounded-4">
      <Box className="fs-3 fw-bolder mb-3 ms-2"> My Chats</Box>
      <Box className="d-flex flex-column bg-light w-100">
        {chats ? (
          <>
            <ChatList chats={chats} />
          </>
        ) : (
          "Loading..."
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
