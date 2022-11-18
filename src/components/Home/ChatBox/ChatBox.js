import { Avatar, Box, Tooltip } from "@mui/material";
import axios from "axios";
import { Form } from "react-bootstrap";
import React, { useEffect, useRef, useState } from "react";

import { API_URL } from "../../../App";
import { ChatState } from "../../../context/ChatProvider";
import Cross from "../../../assets/Cross.svg";
import { getSenderFullDetails } from "../../../helpers/ChatLogics";
import ScrollableChat from "./ScrollableChat";
import UserModal from "../NavBar/UserModal";
import { io } from "socket.io-client";
var socket, selectedChatCompare;

const ChatBox = () => {
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [chatProfile, setChatProfile] = useState([]);
  const [open, setOpen] = useState(false);
  const msgRef = useRef(null);
  const {
    selectedChat,
    user,
    messages,
    setMessages,
    toggleDrawer,
    toggleLeft,
    setNotification,
    notification,
  } = ChatState();

  const handleModal = () => setOpen(true);
  const modalClose = () => setOpen(false);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/chat/messages/${selectedChat._id}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setMessages(res.data);
      socket.emit("join chat", selectedChat._id);
      setChatProfile(getSenderFullDetails(user, selectedChat?.users));
    } catch (error) {
      alert(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      socket = io(API_URL);
      socket.emit("setup", user);
    }
  }, [user]);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    if (user?.userId) {
      socket.on("message received", (newMessageReceived) => {
        switch (newMessageReceived.chat._id) {
          case selectedChatCompare?._id:
            setMessages([...messages, newMessageReceived]);
            break;
          default:
            if (!notification.includes(newMessageReceived)) {
              setNotification([newMessageReceived, ...notification]);
            }
        }
      });
    }
  });

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage !== "") {
      e.preventDefault();
      if (newMessage.length <= 250) {
        try {
          setNewMessage("");
          const res = await axios.post(
            `${API_URL}/chat/message`,
            {
              content: newMessage,
              chatId: selectedChat?._id,
            },
            {
              headers: {
                Authorization: `Bearer ${user?.token}`,
              },
            }
          );
          socket.emit("new message", res?.data);
          setMessages([...messages, res.data]);
        } catch (error) {
          alert(error);
        }
      } else {
        alert("message length should less than 100 characters");
      }
    }
  };

  useEffect(() => {
    msgRef.current?.scrollIntoView();
  }, [messages]);

  return (
    <Box className="shadow m-1 p-3 chatBox_wrapper rounded-4">
      {selectedChat ? (
        <>
          <div className="d-flex justify-content-between align-items-center  w-100 pb-2 px-2 fs-3">
            <div>
              <div className="d-flex align-items-center">
                <Tooltip title="Profile Details">
                  <Avatar
                    className="me-3"
                    src={chatProfile?.pic}
                    style={{ cursor: "pointer" }}
                    onClick={handleModal}
                  />
                </Tooltip>
                {chatProfile?.userName}
              </div>
            </div>
            <div className="display_none">
              <Tooltip title="Open My Chats">
                <img
                  src={Cross}
                  alt="Cross icon"
                  onClick={() => toggleDrawer(toggleLeft)}
                  style={{ cursor: "pointer" }}
                  className="me-2"
                />
              </Tooltip>
            </div>
          </div>
          <Box
            className="bg-light px-3 pb-3 mt-1 d-flex flex-column justify-content-end h-100"
            style={{ overflowY: "hidden" }}
          >
            {loading ? (
              "Loading..."
            ) : (
              <>
                <div className="d-flex flex-column chat_content">
                  <ScrollableChat messages={messages} />
                  <div ref={msgRef} />
                </div>
              </>
            )}
            <Form onKeyDown={sendMessage} className="mt-3">
              <Form.Control
                type="text"
                placeholder="Press Enter to send your message... "
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              {/* <div className="text-muted text-end" style={{ fontSize: "13px" }}>
                upto 100 characters length...
              </div> */}
            </Form>
          </Box>
        </>
      ) : (
        <Box className="fs-2 text-muted d-flex justify-content-center align-items-center h-100">
          Click on user to open chat.
        </Box>
      )}

      <UserModal open={open} modalClose={modalClose} user={chatProfile} />
    </Box>
  );
};

export default ChatBox;
