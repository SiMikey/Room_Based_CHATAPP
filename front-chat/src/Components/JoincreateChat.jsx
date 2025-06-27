import React, { useState } from "react";
import chaticon from "../assets/chaticon.png";
import toast from "react-hot-toast";
import { createRoomApi, joinRoomApi } from "../services/RoomServices";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";

const JoincreateChat = () => {
  const [details, setdetails] = useState({
    roomId: "",
    userName: "",
  });

  const { setroomId, setcurrentUser, setconnected } = useChatContext();
  const navigate = useNavigate();

  function handleFormInputChange(event) {
    setdetails({
      ...details,
      [event.target.name]: event.target.value,
    });
  }

  function validateForm() {
    if (details.roomId === "" || details.userName === "") {
      toast.error("Invalid Input!!");
      return false;
    }
    return true;
  }

  async function joinChat() {
    if (validateForm()) {
      try {
        const room = await joinRoomApi(details.roomId);
        toast.success("Room is joined successfully");
        setcurrentUser(details.userName);
        setroomId(room.roomId);
        setconnected(true);
        navigate("/chat");
      } catch (error) {
        if (error.response?.status === 400) {
          toast.error(error.response.data);
        } else {
          toast.error("Error in joining room!!!!!");
        }
        console.log(error);
      }
    }
  }

  async function createChat() {
    if (validateForm()) {
      try {
        const response = await createRoomApi(details.roomId);
        toast.success("Room Created Successfully .....");
        setcurrentUser(details.userName);
        setroomId(response.roomId);
        setconnected(true);
        navigate("/chat");
      } catch (error) {
        console.log(error);
        if (error.response?.status === 400) {
          toast.error("Room already exists....");
        } else {
          toast.error("Error in creating room..");
        }
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-12 dark:border-white border w-full flex flex-col gap-5 max-w-md rounded dark:bg-gray-900">
        {/* Icon */}
        <div>
          <img src={chaticon} className="w-14 mx-auto" alt="Chat Icon" />
        </div>

        {/* Header */}
        <h1 className="text-2xl font-semibold text-center">
          Join Room / Create Room
        </h1>

        {/* User Name Input */}
        <div>
          <label htmlFor="name" className="block font-medium mb-2">
            Your Name
          </label>
          <input
            name="userName"
            onChange={handleFormInputChange}
            value={details.userName}
            placeholder="Enter Your Name..."
            type="text"
            id="name"
            className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Room ID Input */}
        <div>
          <label htmlFor="roomid" className="block font-medium mb-2">
            Room Id / New Room Id
          </label>
          <input
            name="roomId"
            onChange={handleFormInputChange}
            value={details.roomId}
            placeholder="Enter Room Id ....."
            type="text"
            id="roomid"
            className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-3">
          <button
            onClick={joinChat}
            className="px-3 py-2 dark:bg-blue-500 hover:dark:bg-blue-600 rounded-full"
          >
            Join Room
          </button>
          <button
            onClick={createChat}
            className="px-3 py-2 dark:bg-pink-500 hover:dark:bg-pink-700 rounded-full"
          >
            Create New
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoincreateChat;
