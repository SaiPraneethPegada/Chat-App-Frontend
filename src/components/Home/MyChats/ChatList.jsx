import { Avatar, Box } from "@mui/material";
import { Stack } from "@mui/system";
import React from "react";
import { ChatState } from "../../../context/ChatProvider";
import { getSender, getSenderPic } from "../../../helpers/ChatLogics";

const ChatList = ({ chats }) => {
  const activeBackground = {
    color: "white",
    backgroundColor: "#38B2AC",
    cursor: "pointer",
  };

  const inActiveBackground = {
    color: "black",
    backgroundColor: "white",
    cursor: "pointer",
  };
  const { setSelectedChat, selectedChat, user, setChatOpened } = ChatState();

  return (
    <>
      {user ? (
        <Stack>
          {chats?.map((chat) => (
            <Box
              className="px-3 py-1 mb-2 chat_stack"
              key={chat._id}
              onClick={() => {
                setSelectedChat(chat);
                setChatOpened(true);
              }}
              style={
                selectedChat !== chat ? inActiveBackground : activeBackground
              }
            >
              <div className="d-flex">
                <Avatar
                  src={getSenderPic(user, chat.users)}
                  alt={getSender(user, chat.users)}
                  className="me-3"
                />
                <div>
                  <div className="fs-6">{getSender(user, chat.users)}</div>
                  {chat.latestMessage && (
                    <div>
                      <b>
                        {chat?.latestMessage?.sender?._id !== user?.userId
                          ? chat.latestMessage.sender.userName
                          : "you"}
                        :
                      </b>{" "}
                      {chat?.latestMessage?.content.length > 25
                        ? chat.latestMessage.content.substring(0, 26) + "..."
                        : chat.latestMessage.content}
                    </div>
                  )}
                </div>
              </div>
            </Box>
          ))}
        </Stack>
      ) : (
        ""
      )}
    </>
  );
};

export default ChatList;
