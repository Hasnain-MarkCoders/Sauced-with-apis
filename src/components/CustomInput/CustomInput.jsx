import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { scale } from 'react-native-size-matters'
import closeEye from "./../../../assets/images/scaledCloseEye.png"
const CustomInput = ({ title = "",autoFocus =false, uri = "",localImage=false, isURL = true, multiline = false, numberOfLines = 1, name = "", cb = () => { }, placeholder = "", showTitle = true, secureTextEntry = false, onChange = () => { }, showImage = false, value = "", imageStyles = {}, updaterFn = () => { }, containterStyle = {}, labelStyle = {}, inputStyle = {} }) => {
  const [showPassord, setShowPassword] = useState(secureTextEntry)
  return (
    <View style={{
      ...containterStyle,

    }}>
      {showTitle && <Text style={{
        fontSize: 20,
        color: "white",
        borderBottomColor: "white",
        ...labelStyle,
      }}>{title}</Text>}
      <View style={{
        position: "relative",
      }}>
        {(showImage && secureTextEntry )?
          <TouchableOpacity
            style={{
             ...imageStyles,
              zIndex:2,
              position:"absolute"
            }}
            onPress={() => {
              setShowPassword(prev => !prev)
            }}>
            <Image
              style={{
                width: "100%",
                height: "100%",
              }} source={isURL ? { uri } :localImage?url: (showPassord ? uri : closeEye)} />
          </TouchableOpacity>
          : <Image
          style={{
            width: scale(30),
            height: scale(30),
            borderRadius: scale(50),
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 1,
            transform: [{ translateY: -0.5 * scale(30) }],
            ...imageStyles
          }} source={isURL ? { uri } :uri} />


        }
        <TextInput
        autoFocus={autoFocus}
          multiline={multiline}
          numberOfLines={numberOfLines}
          placeholder={placeholder}
          placeholderTextColor="white"
          secureTextEntry={showPassord}
          style={{
            color: "white",
            borderBottomColor: "white",
            borderBottomWidth: 1,
            ...inputStyle,

          }}
          onChangeText={(text) => { onChange(text, name, updaterFn), cb(text) }}
          value={value}
        />
      </View>

    </View>
  )
}

export default CustomInput

const styles = StyleSheet.create({})