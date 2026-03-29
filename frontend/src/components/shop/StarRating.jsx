import React, { useState } from "react";
import "./Components.css";

export default function StarRating({ rating = 0, onRatingChange, readonly = false }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="star-rating">
      {[...Array(5)].map((_, index) => {
        index += 1;
        return (
          <button
            type="button"
            key={index}
            className={`star-btn ${index <= (hover || rating) ? "on" : "off"}`}
            onClick={() => !readonly && onRatingChange(index)}
            onMouseEnter={() => !readonly && setHover(index)}
            onMouseLeave={() => !readonly && setHover(rating)}
            disabled={readonly}
          >
            <span className="star">&#9733;</span>
          </button>
        );
      })}
      {readonly && rating > 0 && <span className="rating-num">({rating})</span>}
    </div>
  );
}
