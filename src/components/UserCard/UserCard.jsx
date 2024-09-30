import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { scale } from 'react-native-size-matters'
import CustomButtom from '../CustomButtom/CustomButtom'
import { useNavigation } from '@react-navigation/native';
import useAxios from '../../../Axios/useAxios';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useSelector } from 'react-redux';

const UserCard = ({ url = "",_id="", item = {}, name = "", title = "", cb = () => { }, showButton=true, buttonOpacity=1 }) => {
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)
 const [isLoading, setIsLoading] = useState(true);
const auth = useSelector(state=>state.auth)
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
          maxWidth: scale(140),
          minHeight:scale(170),
          alignItems:"center",
          justifyContent:"center"
        }}>
       
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
          ></Image>}

        <Text
          numberOfLines={1} ellipsizeMode="tail"
          style={{
            color: "white",
            fontSize: scale(14)

          }}>{name}</Text>


      {showButton &&  <CustomButtom
          loading={loading}
          buttonTextStyle={{ fontSize: scale(12), }}
          buttonstyle={{ width: "100%", borderColor: "#FFA100", padding: 8, backgroundColor: "#2E210A" ,opacity:buttonOpacity}}
          onPress={()=>{cb(item)}}
          title={title} />}
      </View>
    </TouchableOpacity>
  )
}

export default memo(UserCard)

const styles = StyleSheet.create({})