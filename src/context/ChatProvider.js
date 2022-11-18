import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();
  const [toggleLeft, setToggleLeft] = useState(false);
  const [chatOpened, setChatOpened] = useState(false);

  const toggleDrawer = (open) => {
    setToggleLeft(!open);
  };

  useEffect(() => {
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    setUser(userInfo);
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
        messages,
        setMessages,
        toggleLeft,
        setToggleLeft,
        toggleDrawer,
        chatOpened,
        setChatOpened,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
