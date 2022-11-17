import React from 'react'

export default function Ratings(props) {

  const {rating, color="var(--orange)", ratingNumber} = props
  const highestRate = 5
 
  return ( 
    <div className="ratingscont" title={`Rating: ${rating}/${highestRate} stars`}>
      { Array.apply(null, { length: Math.floor(rating) }).map((el,i) => <i className="fas fa-star" style={{color}} key={i}></i> ) } 
      { 
        rating % 1 > 0?
        <>
        <i className="fas fa-star-half-alt" style={{color}}></i>
        { Array.apply(null, { length: (highestRate-1)-Math.floor(rating) }).map((el,i) => ( <i className="far fa-star" style={{color}} key={i}></i> )) }
        </>:
        Array.apply(null, { length: highestRate-Math.floor(rating) }).map((el,i) => ( <i className="far fa-star" style={{color}} key={i}></i> ))
      }
      { 
        ratingNumber ?
        <small>({rating.toFixed(1)})</small> :
        <></>
      }
    </div>
  )
} 