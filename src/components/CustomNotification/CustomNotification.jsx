import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomRating from '../CustomRating/CustomRating'
import { scale } from 'react-native-size-matters'
import { formatEventDate } from '../../../utils'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import useAxios from '../../../Axios/useAxios'

const CustomNotification = ({
  title = "",
  body = "",
  isRead = false,
  _id = "",
  isNavigate = false,
  route = null,
  date=null
}) => {
  const axiosInstance = useAxios()
  const [readMore, setReadMore] = useState(body?.length > 130)
  const navigate = useNavigation()
  const [isAvailable , setIsAvailable] = useState({success:true})
  const isNotificationAvailable = async (_id, route) => {
    const type = route =="BrandScreen"?1:route =="ProductScreen"?2:3
    const res = await axiosInstance.get(`/is-notification-available`, { params: { _id , type} });
    return res;
  }
  
  const time  =date && new Date(parseInt(date))
  const findBrand = async (_id) => {
    const res = await axiosInstance.get(`/get-user`, { params: { _id} });
    return res;
  };

  useFocusEffect(()=>{
    (async()=>{
    const res = await isNotificationAvailable(_id, route)
    setIsAvailable(res?.data?.success)
    })()
  },[])
  const handlenavigate = async() => {
    if (isNavigate&&( route =="BrandScreen"||route =="ProductScreen")&& isAvailable ) {
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
          {!isAvailable && (route =="ProductScreen" || route =="BrandScreen") && <View
        style={{
          backgroundColor: 'red', // Ensure this is applied
          paddingVertical: 4,
          paddingHorizontal: 10,
          borderRadius: 10,
          alignSelf: 'flex-start',
      
        }}
        
        >
          <Text style={{
            
              color: 'white',
              fontWeight: 'bold',
              fontSize: 7,
            
          }}>
          Deleted
          </Text>
        </View>}
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
         time&& formatEventDate(time, true)
        }
    
      </Text>}
    </View>
  )
}

export default CustomNotification
