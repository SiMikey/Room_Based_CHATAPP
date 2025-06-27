package com.dip.chatRoom.Room.based.chat.app.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Message {
    private String Sender;
    private String Content;
    private LocalDateTime Timestamp;

    public Message(String sender, String content) {
        this.Sender = sender;
        this.Content = content;
        this.Timestamp = LocalDateTime.now();
    }
}
