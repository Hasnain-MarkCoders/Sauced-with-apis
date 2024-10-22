import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { scale } from 'react-native-size-matters'
import CustomProgress from '../CustomProgress/CustomProgress'
import useAxios from '../../../Axios/useAxios'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'

const Award = ({url="", percentage, name}) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <View style={{
        flexBasis:"48%",
        borderRadius:scale(10),
        borderColor:"#FFA100",
        borderWidth:1,
        alignItems:"center",
        gap:scale(20),
        justifyContent:"space-between",
        paddingVertical:scale(20),
        margin:scale(4),
        position:"relative"
    }}>
      <Text style={{
        color:"white",
        fontSize:scale(16)
      }}> {name}</Text>
      <Image style={{
        width:scale(80),
        height:scale(80),
        borderRadius:scale(50),
        // display:isLoading?"none":"flex",
        opacity:isLoading?0:1,
        position:isLoading?"absolute":"relative"


      }}
      onLoad={() => setIsLoading(false)}
      source={{uri:url}}

      ></Image>
      {isLoading && (
        <SkeletonPlaceholder speed={1600}  backgroundColor='#2E210A'  highlightColor='#fff' >
          <SkeletonPlaceholder.Item              width={scale(80)}
            height={scale(80)}
            borderRadius={scale(58)}

            />
        </SkeletonPlaceholder>
      )}
      <CustomProgress  percentage={percentage} name={name}/>

    </View>
  )
}

export default Award

const styles = StyleSheet.create({})