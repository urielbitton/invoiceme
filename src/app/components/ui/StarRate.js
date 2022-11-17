import React from 'react'

export default function StarRate({number, rating, starNum, setRating}) {

  return (
    <i 
      className={
        starNum >= rating && Math.ceil(rating) >= starNum && rating % 1 !== 0 ? "fas fa-star-half-alt" :
        Math.round(rating) < starNum ? "fal fa-star" : "fas fa-star"
      }
      onClick={() => setRating(number)}
    ></i>
  )
}
