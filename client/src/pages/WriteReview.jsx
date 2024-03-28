import React, { useState } from 'react';
import {  useSelector } from 'react-redux';
import Rating from '@mui/material/Rating';
import styles from '../styles/WriteReview.module.css';

const WriteReview = ({ listingId, onClose }) => {

  const customerId = useSelector((state) => state?.user?._id);

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const handleRatingChange = (event, newRating) => {
    setRating(newRating);
  };

  const handleSubmitReview = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`https://dark-teal-hatchling-hem.cyclic.app/review/create/${listingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: customerId, // Replace with the actual userId
          reviewText,
          rating,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      // Reset review form fields and close the review form
      setReviewText('');
      setRating(0);
      onClose(); // Close the review form
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <form className={styles.reviewForm} onSubmit={handleSubmitReview}>
      <label className={styles.reviewLabel}>Your Rating:</label>
      <Rating value={rating} onChange={handleRatingChange} />
      <label className={styles.reviewLabel}>Your Review:</label>
      <textarea
        className={styles.reviewTextarea}
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
      />
      <div className={styles.reviewButtons}>
        <button className={styles.reviewButton} type="submit">
          Submit Review
        </button>
        <button className={styles.cancelButton} onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default WriteReview;
