package com.dip.chatRoom.Room.based.chat.app.controllers;

import com.dip.chatRoom.Room.based.chat.app.config.AppConstants;
import com.dip.chatRoom.Room.based.chat.app.dto.RoomRequest;
import com.dip.chatRoom.Room.based.chat.app.entities.Message;
import com.dip.chatRoom.Room.based.chat.app.entities.Room;
import com.dip.chatRoom.Room.based.chat.app.repositories.RoomRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/rooms")
@CrossOrigin(AppConstants.FRONT_END_BASE_URL)
public class RoomController {

    private final RoomRepository roomRepository;

    public RoomController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody RoomRequest request){
        String roomId = request.getRoomId();
        if(roomRepository.findByRoomId(roomId)!= null){
            return ResponseEntity.badRequest().body("Room Already Exists");
        }

        Room room = new Room();
        room.setRoomId(roomId);
        Room saveroom = roomRepository.save(room);
        return ResponseEntity.status(HttpStatus.CREATED).body(saveroom);
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<?> joinroom(@PathVariable String roomId){
        System.out.println("Trying to join room with ID: " + roomId);

        Room room = roomRepository.findByRoomId(roomId);

        if(room == null){
            System.out.println("Room not found");
            return ResponseEntity.badRequest().body("Room Not Found");
        }

        System.out.println("Room found: " + room);
        return ResponseEntity.ok(room);
    }


    @GetMapping("/{roomId}/messages")
    public ResponseEntity<List<Message>> getMessages(@PathVariable String roomId,
                                                     @RequestParam(value ="page" , defaultValue ="0" , required = false) int page,
                                                     @RequestParam(value ="size" , defaultValue ="20" , required = false) int size){

         Room room = roomRepository.findByRoomId(roomId);
        if (room == null){
            return ResponseEntity.badRequest().build();
        }
        List<Message> messages = room.getMessages();
        int start = Math.max(0 , messages.size() - (page+1)*size);
        int end = Math.min(messages.size(), start+size);
        List<Message> paginatedMessages = messages.subList(start , end);
        return ResponseEntity.ok(paginatedMessages);
    }
    

}
