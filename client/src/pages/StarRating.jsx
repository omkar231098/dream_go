import React from 'react';
import Rating from '@mui/material/Rating';

const StarRating = ({ rating }) => {
  console.log('Rating prop:', rating); // Log the rating prop value

  return (
    <Rating
      name="star-rating"
      value={rating}
      precision={0.5}
      max={5}
    
      readOnly
      size="small"
    />
  );
};

export default StarRating;
