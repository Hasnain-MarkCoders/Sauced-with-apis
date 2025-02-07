import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import CustomRating from '../CustomRating/CustomRating'
import { scale } from 'react-native-size-matters'
import { formatEventDate } from '../../../utils'
import { useNavigation } from '@react-navigation/native'
import useAxios from '../../../Axios/useAxios'

const CustomNotification = ({
  title = "",
  body = "",
  isRead = false,
  _id = null,
  isNavigate = false,
  route = null
}) => {
  const axiosInstance = useAxios()
  const [readMore, setReadMore] = useState(body?.length > 130)
  const navigate = useNavigation()
  const findBrand = async (_id) => {
    const res = await axiosInstance.get(`/get-user`, { params: { _id} });
    return res;
  };
  const handlenavigate = async() => {
   
    if (isNavigate) {
      if(route =="ProductScreen"){
        navigate.navigate(route, {
          _id
        })
      }
      else{
       const brand =  await findBrand(_id)
       const data = {brand:brand?.data?.user}
        const title  =brand?.data?.user?.name
        const url  =brand?.data?.user?.image
       if(route =="BrandScreen"){
        navigate.navigate(route, {
         item:data,
         title,
         url
        })
      }
  
      }
    }
  }

  return (
    <View

      onTouchEnd={() => { handlenavigate() }}
      style={{
        backgroundColor: isRead ? "#482905" : "#2e210a",
        borderColor: "#FFA100",
        borderWidth: 1,
        paddingVertical: scale(10),
        paddingHorizontal: scale(10),
        borderRadius: scale(12),
        position: "relative",
        gap: scale(5)
      }}>
      <Text style={{
        color: "white",
        fontWeight: 700,
        fontSize: scale(14),
        lineHeight: scale(17)
      }}>
        {title}
      </Text>
      <View
        style={{ flexDirection: 'row', flexWrap: 'wrap' }}
      >
        <Text style={{
          color: "white"
        }}>
          {!readMore ? body : `${body?.slice(0, 130)}... `}
        </Text>

        {
          body.length < 130
            ? null
            :
            <TouchableOpacity onPress={() => setReadMore(prev => !prev)}>
              <Text style={{ color: '#FFA100', textDecorationLine: "underline" }}>{!readMore ? 'See less' : 'See more'}</Text>
            </TouchableOpacity>
        }

      </View>
      {<Text style={{
        position: "absolute",
        top: scale(10),
        right: scale(10),
        fontSize: scale(11),
        color: "white"
      }}>
        {
          formatEventDate(new Date()?.getTime(), true)
        }
      </Text>}
    </View>
  )
}

export default CustomNotification
