package com.project.hotelreservation.repository;

import com.project.hotelreservation.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ReviewRepository extends MongoRepository<Review, String>{
}
