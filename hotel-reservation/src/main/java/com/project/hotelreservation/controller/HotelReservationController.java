package com.project.hotelreservation.controller;

import com.project.hotelreservation.model.*;
import com.project.hotelreservation.repository.HotelRepository;
import com.project.hotelreservation.repository.ReservationRepository;
import com.project.hotelreservation.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
@RestController
public class HotelReservationController {

    @Autowired
    HotelRepository hotelRepository;

    @Autowired
    ReservationRepository reservationRepository;

    @Autowired
    ReviewRepository reviewRepository;

    @GetMapping("/hotels")
    public ResponseEntity<List<Hotel>> getAllHotels() {
        try {
            List<Hotel> hotels = hotelRepository.findAll();
            return ResponseEntity.ok(hotels);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/hotel/{id}")
    public ResponseEntity<Hotel> getHotelById(@PathVariable("id") int id) {
        try {
            // Retrieve the hotel by ID
            Optional<Hotel> optionalHotel = hotelRepository.findById(id);
            if (optionalHotel.isPresent()) {
                return ResponseEntity.ok(optionalHotel.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/hotelsInRange")
    public ResponseEntity<List<Hotel>> getHotelsInRange(
            @RequestParam("userLatitude") double userLatitude,
            @RequestParam("userLongitude") double userLongitude,
            @RequestParam("radiusKm") double radiusKm) {

        try {
            // Retrieve all hotels from the repository
            List<Hotel> allHotels = hotelRepository.findAll();
            double radiusM = radiusKm * 1000;
            // Filter hotels based on the specified radius
            List<Hotel> nearbyHotels = new ArrayList<Hotel>();
            for (Hotel hotel : allHotels) {
                double distance = calculateDistance(userLatitude, userLongitude, hotel.getLatitude(), hotel.getLongitude());
                if (distance <= radiusM) {
                    nearbyHotels.add(hotel);
                }
            }

            return ResponseEntity.ok(nearbyHotels);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    public double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double R = 6378.137; // Radius of the Earth in kilometers
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        double d = R * c; // Haversine formula
        return d * 1000; // Distance in meters
    }

    @PostMapping("/bookRooms")
    public ResponseEntity<String> bookRooms(@RequestParam("hotelId") int hotelId,
                                            @RequestBody RoomBookingRequest roomBookingRequest,
                                            @RequestParam("username") String username) {
        try {
            // Retrieve the hotel by ID
            Optional<Hotel> optionalHotel = hotelRepository.findById(hotelId);
            if (optionalHotel.isPresent()) {
                Hotel hotel = optionalHotel.get();

                // Create a reservation
                Reservation reservation = new Reservation();
                reservation.setUsername(username);
                reservation.setHotelId(String.valueOf(hotelId));
                reservation.setReservationDateTime(roomBookingRequest.checkIn);
                reservation.setRoomNumbers(new ArrayList<Integer>());

                // Update room availability based on booked room numbers
                for (Integer roomNumber : roomBookingRequest.bookedRooms) {
                    Optional<Room> optionalRoom = hotel.getRooms().stream()
                            .filter(room -> room.getRoomNumber() == roomNumber)
                            .findFirst();
                    if (optionalRoom.isPresent()) {
                        Room room = optionalRoom.get();
                        if(room.isAvailable() == false){
                            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Room is not available.");
                        }
                        else {
                            room.setAvailable(false); // Set room availability to false
                            reservation.getRoomNumbers().add(roomNumber);
                        }
                    }

                }
                System.out.println(reservation.getReservationDateTime());
                reservationRepository.save(reservation);

                // Save the changes to the database
                hotelRepository.save(hotel);

                return ResponseEntity.ok("Rooms booked successfully!");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Hotel not found.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to book rooms.");
        }
    }

    @PostMapping("/cancelReservation")
    public ResponseEntity<String> cancelReservation(@RequestParam("reservationId") String reservationId) {
        try {
            // Retrieve the reservation by ID
            Optional<Reservation> optionalReservation = reservationRepository.findById(reservationId);
            if (optionalReservation.isPresent()) {
                Reservation reservation = optionalReservation.get();

                // Calculate the check-in time (two hours after the reservation time)
                LocalDateTime checkInTime = reservation.getReservationDateTime().plusHours(2);
                LocalDateTime currentTime = LocalDateTime.now();

                // Check if the current time is at least two hours before the check-in time
                if (currentTime.isBefore(checkInTime)) {
                    // Reset room availability based on booked room numbers
                    Optional<Hotel> optionalHotel = hotelRepository.findById(Integer.valueOf(reservation.getHotelId()));
                    if (optionalHotel.isPresent()) {
                        Hotel hotel = optionalHotel.get();
                        for (Integer roomNumber : reservation.getRoomNumbers()) {
                            Optional<Room> optionalRoom = hotel.getRooms().stream()
                                    .filter(room -> room.getRoomNumber() == roomNumber)
                                    .findFirst();
                            if (optionalRoom.isPresent()) {
                                Room room = optionalRoom.get();
                                room.setAvailable(true); // Set room availability to true
                            }
                        }
                        hotelRepository.save(hotel);
                    }

                    // Allow cancellation
                    reservationRepository.delete(reservation);
                    return ResponseEntity.ok("Reservation cancelled successfully!");
                } else {
                    // Reject cancellation
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cannot cancel reservation. Check-in time has passed.");
                }
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Reservation not found.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to cancel reservation.");
        }
    }


    @PostMapping("/changeRooms")
    public ResponseEntity<String> changeRoom(@RequestParam("reservationId") String reservationId,
                                             @RequestBody RoomBookingRequest roomBookingRequest) {
        try {
            // Retrieve the reservation by ID
            Optional<Reservation> optionalReservation = reservationRepository.findById(reservationId);
            if (optionalReservation.isPresent()) {
                Reservation reservation = optionalReservation.get();
                // Calculate the check-in time (two hours after the reservation time)
                LocalDateTime checkInTime = reservation.getReservationDateTime().plusHours(2);
                LocalDateTime currentTime = LocalDateTime.now();

                // Check if the current time is at least two hours before the check-in time
                if (currentTime.isBefore(checkInTime)) {
                    // Reset room availability based on booked room numbers
                    Optional<Hotel> optionalHotel = hotelRepository.findById(Integer.valueOf(reservation.getHotelId()));
                    if (optionalHotel.isPresent()) {
                        Hotel hotel = optionalHotel.get();
                        for (Integer roomNumber : reservation.getRoomNumbers()) {
                            Optional<Room> optionalRoom = hotel.getRooms().stream()
                                    .filter(room -> room.getRoomNumber() == roomNumber)
                                    .findFirst();
                            if (optionalRoom.isPresent()) {
                                Room room = optionalRoom.get();
                                room.setAvailable(true); // Set room availability to true
                            }
                        }
                        hotelRepository.save(hotel);
                    }

                    List<Integer> newRoomNumbers = roomBookingRequest.bookedRooms;
                    Hotel hotel = optionalHotel.get();
                    System.out.println(hotel.getRooms());
                    // Update the new room availability to false
                    for (Integer roomNumber : newRoomNumbers) {
                        Optional<Room> optionalRoom = hotel.getRooms().stream()
                                .filter(room -> room.getRoomNumber() == roomNumber)
                                .findFirst();
                        if (optionalRoom.isPresent()) {
                            Room room = optionalRoom.get();
                            room.setAvailable(false); // Set room availability to false
                        }
                        hotelRepository.save(hotel);
                    }

                    reservation.setRoomNumbers(newRoomNumbers);
                    reservationRepository.save(reservation);
                    return ResponseEntity.ok("Room changed successfully!");
                } else {
                    // Reject room change
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cannot change room. Check-in time has passed.");
                }
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Reservation not found.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to change room.");
        }
    }

    @PostMapping("/feedback")
    public ResponseEntity<String> leaveFeedback(@RequestParam("hotelId") String hotelId,
                                                      @RequestParam("username") String username,
                                                      @RequestBody ReviewRequest reviewRequest) {
        try {
            Review review = new Review(hotelId, username, reviewRequest.description, reviewRequest.rating);
            reviewRepository.save(review);
            return ResponseEntity.ok("Feedback submitted successfully!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to submit feedback.");
        }
    }

    @GetMapping("/reservations")
    public ResponseEntity<List<Reservation>> getReservationsByUsername(@RequestParam("username") String username) {
        try {
            List<Reservation> reservations = reservationRepository.findAll().stream()
                    .filter(reservation -> reservation.getUsername().equals(username))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(reservations);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/feedbacks")
    public ResponseEntity<List<Review>> getFeedbacksByHotelId(@RequestParam("hotelId") String hotelId) {
        try {
            List<Review> reviews = reviewRepository.findAll().stream()
                    .filter(review -> review.getHotelId().equals(hotelId))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

}
