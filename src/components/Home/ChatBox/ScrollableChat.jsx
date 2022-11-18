import { Avatar } from "@mui/material";
import React from "react";
import { ChatState } from "../../../context/ChatProvider";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../../helpers/ChatLogics";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <>
      {messages &&
        messages?.map((m, i) => (
          <div className="d-flex" key={m._id}>
            {(isSameSender(messages, m, i, user?.userId) ||
              isLastMessage(messages, i, user?.userId)) && (
              <Avatar
                className="me-1"
                src={m.sender.pic}
                name={m.sender.userName}
              />
            )}
            <div
              className="text-nextline"
              style={{
                backgroundColor: `${
                  m.sender._id === user?.userId ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user?.userId),
                marginTop: isSameUser(messages, m, i, user?.userId) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </div>
          </div>
        ))}
    </>
  );
};

export default ScrollableChat;
