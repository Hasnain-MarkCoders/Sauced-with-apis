import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import { scale } from 'react-native-size-matters'

const ProfileImage = ({url="", styles={}}) => {
    const auth = useSelector(state=>state?.auth)
    const { user, authenticated } = auth
  url = auth?.url
  return (
    <Image
        style={{
          width: scale(40),
          height: scale(40),
          borderRadius: scale(50),
          ...styles
        }}
        source={{ uri: url }}
      />
  )
}

export default ProfileImage

const styles = StyleSheet.create({})