package com.dip.chatRoom.Room.based.chat.app.repositories;

import com.dip.chatRoom.Room.based.chat.app.entities.Room;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RoomRepository extends MongoRepository<Room,String> {

    Room findByRoomId(String roomId);

}
