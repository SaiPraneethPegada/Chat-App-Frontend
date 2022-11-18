import axios from "axios";
import { Box, Button, Drawer, TextField } from "@mui/material";
import React, { useState } from "react";

import { API_URL } from "../../../App";
import { ChatState } from "../../../context/ChatProvider";
import ChatList from "./ChatList";
import UserList from "./UserList";

const SideBar = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const {
    setSelectedChat,
    user,
    chats,
    setChats,
    toggleLeft,
    setToggleLeft,
    toggleDrawer,
  } = ChatState();

  const handleSearch = async () => {
    try {
      setLoading(true);
      if (search) {
        const res = await axios.get(`${API_URL}/searchUser?search=${search}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        setSearchResult(res.data);
      }
    } catch (error) {
      alert(error);
    }
    setLoading(false);
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const res = await axios.post(
        `${API_URL}/chat/`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (!chats.find((c) => c._id === res?.data._id))
        setChats([res?.data, ...chats]);
      setSelectedChat(res.data);
      setSearchResult([]);
      setSearch("");
      setToggleLeft(false);
    } catch (error) {
      alert(error);
    }
    setLoadingChat(false);
  };

  return (
    <>
      <Drawer
        anchor="left"
        open={toggleLeft}
        onClose={() => toggleDrawer(toggleLeft)}
      >
        <Box sx={{ width: 350 }} role="presentation">
          <h2 className="text-center">Search Users</h2>
          <hr />
          <Box ml={3} p={2} className="d-flex">
            <TextField
              InputLabelProps={{
                shrink: true,
              }}
              id="outlined-basic"
              label="Search by name or email"
              variant="outlined"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button onClick={() => handleSearch()}>Go</Button>
          </Box>
          {loading
            ? "Loading..."
            : searchResult?.map((user) => (
                <UserList
                  key={user._id}
                  user={user}
                  accessChat={() => accessChat(user._id)}
                />
              ))}
          {loadingChat ? "Loading..." : ""}
          <hr />
          <div className="display_none" style={{ cursor: "pointer" }}>
            <h2 className="text-center mb-3">My Chats</h2>
            <ChatList chats={chats} />
          </div>
        </Box>
      </Drawer>
    </>
  );
};

export default SideBar;
