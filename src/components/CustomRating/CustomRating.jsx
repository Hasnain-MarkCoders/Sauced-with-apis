import React, { useState } from 'react'
import TapRating from 'react-native-ratings/dist/TapRating'

const CustomRating = ({
    size = 9,
    showRating = false,
    ratingContainerStyle = {},
    cb=()=>{},
    initialRating=5,
    isDisabled=false,
    fractions=5
}) => {
    const [rating, setRating] = useState(initialRating);
    const ratingCompleted = (rating) => {
        console.log(rating)
        setRating(rating)
        cb(rating)
    }
    return (
        <TapRating
             isDisabled={isDisabled} 
            onFinishRating={ratingCompleted}
            size={size}
            defaultRating={rating}
            fractions={fractions}
            showRating={showRating}
            ratingContainerStyle={
                {
                    alignItems: "flex-start",
                    ...ratingContainerStyle

                }
            }

        />
    )
}

export default CustomRating