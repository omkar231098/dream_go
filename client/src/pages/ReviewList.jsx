import React, { useState, useEffect } from 'react';
import Rating from '@mui/material/Rating';
import styles from '../styles/ReviewList.module.css';

const ReviewList = ({ listingId }) => {
  const [reviews, setReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`https://dark-teal-hatchling-hem.cyclic.app/review/listing/${listingId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      const data = await response.json();
      setReviews(data.reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [listingId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
  };

  const handleSeeMoreClick = () => {
    setShowAllReviews(true);
  };



  return (
    <>
      <div>
        {reviews.length === 0 && <p>No reviews</p>}
        {reviews.length > 0 && (
          <>
            <ul className={styles.reviewlist}>
              {reviews.slice(0, showAllReviews ? reviews.length : 4).map((review) => (
                <li key={review._id} className={styles.reviewItem}>
                  <div className={styles.imagebox}>
                    <img src={review.user.profileImagePath} alt="User Profile" />
                    <p>
                      {review.user.firstName} {review.user.lastName}
                    </p>
                  </div>
                  <div className={styles.reviewbox}>
                    <Rating value={review.rating} readOnly size="small" />
                    <p className={styles.reviewDate}>{formatDate(review.createdAt)}</p>
                  </div>
                  <div className={styles.userInfo}>
                    <p className={styles.reviewText}>{review.reviewText}</p>
                  </div>
                </li>
              ))}
            </ul>
            {!showAllReviews && (
              <a href="#!" onClick={handleSeeMoreClick}>
                See More Reviews
              </a>
            )}
            {showAllReviews && (
              <a href="#!" onClick={() => setShowAllReviews(false)}>
                Minimize Reviews
              </a>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ReviewList;
