/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [roomId, setroomId] = useState("");
  const [currentUser, setcurrentUser] = useState("");
  const [connected, setconnected] = useState("");

  return (
    <ChatContext.Provider
      value={{
        roomId,
        currentUser,
        connected,
        setroomId,
        setcurrentUser,
        setconnected,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

const useChatContext = () => useContext(ChatContext);
export default useChatContext;
