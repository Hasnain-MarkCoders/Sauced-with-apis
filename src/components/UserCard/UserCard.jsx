import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo, useEffect, useState } from 'react'
import { scale } from 'react-native-size-matters'
import CustomButtom from '../CustomButtom/CustomButtom'
import Lightbox from 'react-native-lightbox';
import { useNavigation } from '@react-navigation/native';
import CustomConfirmModal from '../CustomConfirmModal/CustomConfirmModal';
import useAxios from '../../../Axios/useAxios';

const UserCard = ({ url = "",_id="", item = {}, name = "", title = "", cb = () => { } }) => {
  const [LightBox, setLightBox] = useState(false)
  const [toggledTitle, setToggledTitle] = useState(title)
  // useEffect(()=>{
  // },[title])
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)
  const axiosInstance = useAxios()
useEffect(()=>{
  
},[toggledTitle])
  const handleToggleTitle = async () => {
    setLoading(true);
    try {
        const res = await axiosInstance.post("/follow", {_id});
        console.log("<=====================res.message===============>", res?.message)
            if(res.data.isFollowing){
              setToggledTitle("Unfollow")
            }
            else{
              setToggledTitle("Follow")
            }
        console.log("<======================================checking==================================>", res.data)
    } catch (error) {
        console.error('Failed to fetch photos:', error);
    } finally {
        setLoading(false);
    }
   
  }

  return (

    <TouchableOpacity
      onPress={() => {
        navigation.navigate("ExternalProfileScreen", {
          url,
          name,
          _id
        })
      }}
    >

      <View

        style={{
          minWidth: scale(140),
          flexBasis: "47%",
          borderRadius: scale(10),
          borderColor: "#FFA100",
          borderWidth: 1,
          alignItems: "center",
          gap: scale(10),
          justifyContent: "space-between",
          paddingVertical: scale(15),
          paddingHorizontal: scale(15),
          margin: scale(5),
          overflow: 'hidden',
          maxWidth: scale(140)
        }}>
        <Lightbox activeProps={{ resizeMode: LightBox ? 'contain' : "cover" }}
          springConfig={{ tension: 30, friction: 7 }}
          onOpen={() => setLightBox(true)}
          willClose={() => setLightBox(false)}
        >
          {url && <Image style={{
            width: LightBox ? "100%" : scale(58),
            height: LightBox ? "100%" : scale(58),
            borderRadius: LightBox ? 0 : scale(50),

          }}
            source={{ uri: url }}
          // source={url}


          ></Image>}
        </Lightbox>

        <Text
          numberOfLines={1} ellipsizeMode="tail"
          style={{
            color: "white",
            fontSize: scale(14)

          }}>{name}</Text>


        <CustomButtom
          loading={loading}

          buttonTextStyle={{ fontSize: scale(12) }}
          buttonstyle={{ width: "100%", borderColor: "#FFA100", padding: 8, backgroundColor: "#2E210A" }}
          // onPress={()=>{cb(item)}}
          onPress={() => { handleToggleTitle() }}

          title={toggledTitle} />

      </View>
    </TouchableOpacity>
    // <></>

  )
}

export default memo(UserCard)

const styles = StyleSheet.create({})