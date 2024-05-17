package com.project.hotelreservation.model;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "reviews")
public class Review {
    private String id;
    private String hotelId;
    private String username;
    private String review;
    private int rating;

    public Review() {
        super();
    }

    public Review( String hotelId, String username, String review, int rating) {
        super();
        this.hotelId = hotelId;
        this.username = username;
        this.review = review;
        this.rating = rating;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getHotelId() {
        return hotelId;
    }

    public void setHotelId(String hotelId) {
        this.hotelId = hotelId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getReview() {
        return review;
    }

    public void setReview(String review) {
        this.review = review;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }
}
