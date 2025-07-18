

import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface RatingsProps {
  ratings?: number; // Should be between 0 and 5 (e.g. 4.5)
}

const Ratings: React.FC<RatingsProps> = ({ ratings = 0 }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (ratings >= i) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    } else if (ratings >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-gray-400" />);
    }
  }

  return (
    <div className="flex items-center gap-1">
      {stars}
      {/* <span className="text-sm text-gray-600 ml-2">({ratings.toFixed(1)})</span> */}
    </div>
  );
};

export default Ratings;
