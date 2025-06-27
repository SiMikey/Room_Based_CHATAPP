/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { MdAttachFile, MdSend } from "react-icons/md";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";
import SockJS from "sockjs-client";
import { baseUrl } from "../config/AxiosHelper";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";
import { getMessageApi } from "../services/RoomServices";
import { timeAgoMessage } from "../config/helper";

const ChatPage = () => {
  const {
    roomId,
    currentUser,
    connected,
    setconnected,
    setroomId,
    setcurrentUser,
  } = useChatContext();

  const navigate = useNavigate();
  useEffect(() => {
    if (!connected) {
      navigate("/");
    }
  }, [roomId, currentUser, connected, navigate]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const ChatBoxRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    if (ChatBoxRef.current) {
      ChatBoxRef.current.scroll({
        top: ChatBoxRef.current.scrollHeight,
        behaviour: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    async function loadMessage() {
      try {
        const messages = await getMessageApi(roomId);
        setMessages(messages);
      } catch (error) {
        console.log(error);
      }
    }
    loadMessage();
  }, []);

  useEffect(() => {
    const ConnectWebSocket = () => {
      const sock = new SockJS(`${baseUrl}/chat`);
      const client = Stomp.over(sock);

      client.connect({}, () => {
        setStompClient(client);
        toast.success("Connected");

        client.subscribe(`/topic/room/${roomId}`, (messages) => {
          console.log(messages);
          const newMsg = JSON.parse(messages.body);
          setMessages((prev) => [...prev, newMsg]);
        });
      });

      // Optional: Add error handling if needed
      client.onStompError = (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      };
    };

    ConnectWebSocket();
  }, [baseUrl, roomId]); // Added dependencies to avoid infinite re-renders

  const sendMessage = async () => {
    if (stompClient && connected && input.trim()) {
      console.log(input);

      const message = {
        sender: currentUser,
        content: input,
        roomId: roomId,
      };

      stompClient.send(
        `/app/sendMessage/${roomId}`,
        {},
        JSON.stringify(message)
      );
      setInput("");
    }
  };

  function handleLogOut() {
    stompClient.disconnect();
    setconnected(false);
    setroomId("");
    setcurrentUser("");
    navigate("/");
  }

  return (
    <div>
      {/* header container*/}
      <header className="flex justify-around fixed w-full dark:border-b-gray-600  py-5 dark:bg-gray-900">
        <div>
          <h1 className="text-2xl font-semibold">
            Room Id : <span>{roomId}</span>
          </h1>
        </div>

        <div>
          <h1 className="text-2xl font-semibold">
            User : <span>{currentUser}</span>
          </h1>
        </div>

        <div>
          <button
            onClick={handleLogOut}
            className="px-3 py-2 dark:bg-red-500 hover:dark:bg-red-700 rounded-lg font-semibold"
          >
            Leave Room
          </button>
        </div>
      </header>

      {/* main body container*/}
      <main
        ref={ChatBoxRef}
        className="h-screen py-20 px-10 w-2/3  mx-auto dark:bg-inherit overflow-auto"
      >
        <div className="Message_container"></div>

        <div className="flex flex-col gap-4">
          {messages.map((message, index) => {
            const isCurrentUser = message.sender === currentUser;

            return (
              <div
                key={index}
                className={`flex items-start ${
                  isCurrentUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isCurrentUser && (
                  <img
                    className="w-10 h-10 rounded-full mr-2"
                    src="https://xsgames.co/randomusers/avatar.php?g=male"
                    alt=""
                  />
                )}

                <div
                  className={`max-w-xs px-4 py-2 rounded-lg shadow-md flex flex-col ${
                    isCurrentUser
                      ? "bg-green-500 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm font-bold">{message.sender}</p>
                  <p>{message.content}</p>
                  <p className="text-xs text-black text-right">
                    {timeAgoMessage(message.timestamp)}
                  </p>
                </div>

                {isCurrentUser && (
                  <img
                    className="w-10 h-10 rounded-full ml-2"
                    src="https://xsgames.co/randomusers/avatar.php?g=male"
                    alt="avatar"
                  />
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* msg container*/}
      <div className=" fixed bottom-4 h-16 w-full">
        <div className="flex items-center justify-between pr-10 gap-3  dark:bg-gray-800 rounded-full h-16 w-1/3 mx-auto">
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                sendMessage();
              }
            }}
            type="text"
            placeholder="Type your message here..."
            className="px-5 py-2 h-full w-full rounded-full dark:border-bg-gray-800 border dark:bg-gray-700  focus:outline-none"
          ></input>

          <div className="flex gap-2">
            <button className="dark:bg-pink-600 h-10 w-10 flex items-center justify-center rounded-lg hover:dark:bg-pink-700">
              <MdAttachFile size={20} />
            </button>
            <button
              onClick={sendMessage}
              className="dark:bg-green-600 h-10 w-10 flex items-center justify-center rounded-lg hover:dark:bg-green-700"
            >
              <MdSend size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
