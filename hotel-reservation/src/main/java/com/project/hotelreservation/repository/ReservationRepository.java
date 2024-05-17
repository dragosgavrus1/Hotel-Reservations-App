package com.project.hotelreservation.repository;

import com.project.hotelreservation.model.Reservation;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ReservationRepository extends MongoRepository<Reservation, String> {
}
