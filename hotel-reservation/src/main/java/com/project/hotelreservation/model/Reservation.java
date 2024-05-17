package com.project.hotelreservation.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "reservations")
public class Reservation {
    @Id
    private String id;
    private String username;
    private String hotelId;
    private List<Integer> roomNumbers;
    private LocalDateTime reservationDateTime;

    public Reservation() {
    }
    public Reservation(String username, String hotelId, List<Integer> roomNumbers, LocalDateTime reservationDateTime) {
        this.username = username;
        this.hotelId = hotelId;
        this.roomNumbers = roomNumbers;
        this.reservationDateTime = reservationDateTime;
    }
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getHotelId() {
        return hotelId;
    }
    public void setHotelId(String hotelId) {
        this.hotelId = hotelId;
    }
    public List<Integer> getRoomNumbers() {
        return roomNumbers;
    }
    public void setRoomNumbers(List<Integer> roomNumbers) {
        this.roomNumbers = roomNumbers;
    }
    public LocalDateTime getReservationDateTime() {
        return reservationDateTime;
    }
    public void setReservationDateTime(LocalDateTime reservationDateTime) {
        this.reservationDateTime = reservationDateTime;
    }

}
