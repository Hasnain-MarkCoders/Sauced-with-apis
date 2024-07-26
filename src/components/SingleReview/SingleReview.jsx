import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useMemo, useState } from 'react'
import CustomRating from '../CustomRating/CustomRating'
import { scale } from 'react-native-size-matters'
import { generateRandomText } from '../../../utils'

const SingleReview = ({
    // text=generateRandomText()
}) => {
    const text = useMemo(()=>generateRandomText(),[]) 

    const[ readMore,setReadMore]=useState(text?.length>130)
  return (
    <View style={{
        backgroundColor:"#2e210a",
        borderColor:"#FFA100",
        borderWidth:1,
        paddingVertical:scale(10),
        paddingHorizontal:scale(10),
        borderRadius:scale(12),
        position:"relative",
        gap:scale(5)
      }}>
        <Text style={{
        color: "white",
        fontWeight: 700,
        fontSize: scale(14),
        lineHeight: scale(17)
    }}>
          Mike Smith
        </Text>
        <CustomRating ratingContainerStyle={{
          pointerEvents:"none"
        }}  size={10}/>

        <View 
            style={{ flexDirection: 'row', flexWrap: 'wrap' }}
        >
          <Text style={{
            color:"white"
          }}>
            {!readMore ? text : `${text.slice(0, 130)}... `}
          </Text>
          <TouchableOpacity onPress={() => setReadMore(prev => !prev)}>
            <Text style={{ color: '#FFA100', textDecorationLine:"underline" }}>{!readMore ? 'See less' : 'See more'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={{
            position:"absolute",
            top:scale(10),
            right:scale(10),
            fontSize:scale(11),
            color:"white"
        }}>
          5 Mar
        </Text>
      </View>
  )
}

export default SingleReview

const styles = StyleSheet.create({})