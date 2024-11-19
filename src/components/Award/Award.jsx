import { Image, StyleSheet, Text, View,TouchableOpacity, Alert } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { scale } from 'react-native-size-matters'
import CustomProgress from '../CustomProgress/CustomProgress'
import useAxios from '../../../Axios/useAxios'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import AwardModal from '../AwardModal/AwardModal'

const Award = ({url="", percentage, name, description}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  return (
    <TouchableOpacity 
    style={{
      flexBasis:"48%",
      borderRadius:scale(10),
      borderColor:"#FFA100",
      borderWidth:1,
      margin:scale(4),
      position:"relative"
    }}
    onPress={()=>{
      setShowModal(true)
    }}
    >

    <View style={{
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
    <AwardModal
    title={name}
    url={url}
    description={description}
    modalVisible={showModal}
    setModalVisible={setShowModal}
    />
    </TouchableOpacity>
  )
}

export default Award

const styles = StyleSheet.create({})