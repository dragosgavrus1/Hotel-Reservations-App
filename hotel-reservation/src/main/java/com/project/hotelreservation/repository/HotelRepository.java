package com.project.hotelreservation.repository;

import com.project.hotelreservation.model.Hotel;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface HotelRepository extends MongoRepository<Hotel, Integer> {
}
