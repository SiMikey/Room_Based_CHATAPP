package com.dip.chatRoom.Room.based.chat.app.controllers;

import com.dip.chatRoom.Room.based.chat.app.config.AppConstants;
import com.dip.chatRoom.Room.based.chat.app.entities.Message;
import com.dip.chatRoom.Room.based.chat.app.entities.Room;
import com.dip.chatRoom.Room.based.chat.app.payload.MessageRequest;
import com.dip.chatRoom.Room.based.chat.app.repositories.RoomRepository;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;

@Controller
@CrossOrigin(AppConstants.FRONT_END_BASE_URL)
public class ChatController {
    private RoomRepository roomRepository;

    public ChatController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @MessageMapping("/sendMessage/{roomId}")
    @SendTo("/topic/room/{roomId}")
    public Message sendMessage(@DestinationVariable String roomId, @RequestBody MessageRequest request){

        Room room = roomRepository.findByRoomId(roomId);

        Message msg = new Message();
        msg.setContent(request.getContent());
        msg.setSender(request.getSender());
        msg.setTimestamp(LocalDateTime.now());

        if(room!=null){
            room.getMessages().add(msg);
            roomRepository.save(room);
        }else{
            throw new RuntimeException("Room Not Found!!!!!!");
        }

        return msg;

    }
}
