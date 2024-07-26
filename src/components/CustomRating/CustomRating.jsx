import React, { useState } from 'react'
import TapRating from 'react-native-ratings/dist/TapRating'

const CustomRating = ({
    size = 9,
    showRating = false,
    ratingContainerStyle = {},
    cb=()=>{},
    isDisabled=false
}) => {
    const [rating, setRating] = useState(5);
    const ratingCompleted = (rating) => {
        console.log(rating)
        setRating(rating)
        cb(rating)
    }
    return (
        <TapRating
        isDisbled={isDisabled}
            onFinishRating={ratingCompleted}
            size={size}
            defaultRating={rating}
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