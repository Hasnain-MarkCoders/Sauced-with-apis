import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import CustomRating from '../CustomRating/CustomRating'
import { scale } from 'react-native-size-matters'
import { formatDate, formatEventDate, generateRandomText } from '../../../utils'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'

const SingleReview = ({
  item=null,
  isNavigate=false,
  url,
  _id,
  name
}) => {
  console.log("item", item.createdAt)
  const navigation = useNavigation()
  const auth = useSelector(state=>state?.auth)
    const[ readMore,setReadMore]=useState(item?.text?.length>130)
    console.log(item?.owner?.name)

  return (
    <View

    style={{
        backgroundColor:"#2e210a",
        borderColor:"#FFA100",
        borderWidth:1,
        paddingVertical:scale(10),
        paddingHorizontal:scale(10),
        borderRadius:scale(12),
        position:"relative",
        gap:scale(5)
      }}>
        <TouchableOpacity
            onPress={()=>{
              if(isNavigate){
                  // navigate
                  // if (auth?._id!==_id){
                    navigation.navigate("ExternalProfileScreen", {
                      url,
                      _id,
                      name
                    })
      
                  // }
                  // else{
                  //   navigation.navigate("Profile")
                  // }
              }
          }}
        >

        <Text style={{
        color: "white",
        fontWeight: 700,
        fontSize: scale(14),
        lineHeight: scale(17),
        textDecorationLine: "underline"
        ,textDecorationStyle:"solid"
        ,textDecorationColor:"black"
    }}>
          {item?.owner?.name}
        </Text>
        </TouchableOpacity>
        <CustomRating 
        initialRating={item?.star}
        
        ratingContainerStyle={{
          pointerEvents:"none"
        }}  size={10}/>

        <View 
            style={{ flexDirection: 'row', flexWrap: 'wrap' }}
        >
          <Text style={{
            color:"white"
          }}>
            {!readMore ? item?.text : `${item?.text?.slice(0, 130)}... `}
          </Text>

          {
            item?.text.length<130
            ?null
            :
            <TouchableOpacity onPress={() => setReadMore(prev => !prev)}>
            <Text style={{ color: '#FFA100', textDecorationLine:"underline" }}>{!readMore ? 'See less' : 'See more'}</Text>
          </TouchableOpacity>
          }
          
        </View>
        {item?.createdAt && <Text style={{
            position:"absolute",
            top:scale(10),
            right:scale(10),
            fontSize:scale(11),
            color:"white"
        }}>
          {
            formatEventDate(new Date(item?.createdAt), true)
          }
        </Text>}
      </View>
  )
}

export default SingleReview

const styles = StyleSheet.create({})