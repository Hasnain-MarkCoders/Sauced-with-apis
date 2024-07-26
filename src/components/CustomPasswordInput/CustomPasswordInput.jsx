import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'

const CustomPasswordInput = ({ title = "", uri = "", isURL = true, multiline = false, numberOfLines = 1, name = "", cb = () => { }, placeholder = "", showTitle = true, secureTextEntry = false, onChange = () => { }, showImage = false, value = "", imageStyles = {}, updaterFn = () => { }, containterStyle = {}, labelStyle = {}, inputStyle = {} }) => {
  return (
    <TextInput
    multiline={multiline}
    numberOfLines={numberOfLines}
    placeholder={placeholder}
    placeholderTextColor="white"
    secureTextEntry={secureTextEntry}
    style={{
      color: "white",
      borderBottomColor: "white",
      borderBottomWidth: 1,
      ...inputStyle,

    }}
    onChangeText={(text) => { onChange(text, name, updaterFn), cb() }}
    value={value}
  />
  )
}

export default CustomPasswordInput

const styles = StyleSheet.create({})