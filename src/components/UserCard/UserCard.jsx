import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { scale } from 'react-native-size-matters'
import CustomButtom from '../CustomButtom/CustomButtom'
import Lightbox from 'react-native-lightbox';
import { useNavigation } from '@react-navigation/native';
import useAxios from '../../../Axios/useAxios';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const UserCard = ({ url = "",_id="", item = {}, name = "", title = "", cb = () => { } }) => {
  const [LightBox, setLightBox] = useState(false)
  const [toggledTitle, setToggledTitle] = useState(title)

  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)
  const axiosInstance = useAxios()
 const [isLoading, setIsLoading] = useState(true);


  const handleToggleUserStatus =useCallback( async () => {
    // setLoading(true);
    // try {
    //     const res = await axiosInstance.post("/follow", {_id});
    //     // console.log("<=====================res.message===============>", res?.message)
    //         if(res.data.isFollowing){
    //           // setToggledTitle("Unfollow")
    //            cb(item) 

    //         }
    //         else{
    //           // setToggledTitle("Follow")
    //           cb(item) 

    //         }
    //     // console.log("<======================================checking==================================>", res.data)
    // } catch (error) {
    //     console.error('Failed to fetch photos:', error);
    // } finally {
    //     setLoading(false);
    // }
   
  },[])
useEffect(()=>{

},[item])
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
        {/* <Lightbox activeProps={{ resizeMode: LightBox ? 'contain' : "cover" }}
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
        </Lightbox> */}
{isLoading && (
        <SkeletonPlaceholder speed={1600}  backgroundColor='#2E210A'  highlightColor='#fff' >
          <SkeletonPlaceholder.Item              width={scale(58)}
            height={scale(58)}
            borderRadius={scale(58)}
            
            />
        </SkeletonPlaceholder>
      )}
          {url && <Image
          style={{
            width:scale(58),
            height:scale(58),
            display:isLoading?"none":"flex",

            borderRadius: scale(50),

          }}
          onLoad={() => setIsLoading(false)}
            source={{ uri: url }}
          // source={url}


          ></Image>}

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
          onPress={()=>{cb(item)}}
          // onPress={() => { handleToggleUserStatus()}}

          title={title} />

      </View>
    </TouchableOpacity>
    // <></>

  )
}

export default UserCard

const styles = StyleSheet.create({})