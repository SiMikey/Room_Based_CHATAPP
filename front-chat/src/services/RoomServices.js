import { httpClient } from "../config/AxiosHelper";
import { Await } from "react-router";

export const createRoomApi = async (roomId) => {
  const response = await httpClient.post(
    `/api/v1/rooms`,
    { roomId },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const joinRoomApi = async (roomId) => {
  const response = await httpClient.get(`/api/v1/rooms/${roomId}`);
  return response.data;
};

export const getMessageApi = async (roomId, size = 30, page = 0) => {
  const response = await httpClient.get(
    `/api/v1/rooms/${roomId}/messages?&size=${size}&page=${page}`
  );
  return response.data;
};
