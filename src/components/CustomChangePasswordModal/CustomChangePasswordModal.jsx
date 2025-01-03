import React, { useState } from 'react'
import {  Modal,  Text, View, Image, TouchableOpacity } from 'react-native';
import { scale } from 'react-native-size-matters';
import closeIcon from "./../../../assets/images/close.png"
import CustomButtom from '../CustomButtom/CustomButtom';
import { useSelector } from 'react-redux';
const CustomChangePasswordModal = ({
  modalVisible = false,
  setModalVisible = () => { },
  placeholder="",
  title="",
  cb=()=>{},
  isEnabled=true,
  loading=false,
  value={},
  setValue=()=>{}

}) => {
  const handleBackgroundTouch = () => {
    setModalVisible(false);
  };
  const auth = useSelector(state=>state.auth)
  return (
    modalVisible&&  <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      width: '100%', // Ensure it covers the full screen width
      height: '100%', // Ensure it covers the full screen height
    }}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {

          setModalVisible(!modalVisible);
        }}>
          <TouchableOpacity style={{
                flex: 1,
                
                backgroundColor: 'rgba(33, 22, 10, .85)',

                justifyContent: 'center',
                alignItems: 'center',
              }}
              activeOpacity={1}
              onPressOut={handleBackgroundTouch}>

        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          width:"100%"
        }}>
          <View style={{
            margin: 20,
            borderWidth: scale(.5),
            borderColor: "#FFA100",
            borderRadius: scale(12),
            position: "relative",
            backgroundColor: '#2E210A',
            borderRadius: 20,
            padding: 35,
            gap:scale(20),
            shadowColor: '#000',
            width: "90%",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}>
            <TouchableOpacity

              style={{
                position: "absolute",
                right: scale(20),
                top: scale(20)
              }}
              onPress={() => {
                setModalVisible(false)
              }}>
              <Image style={{
                width: scale(20),
                height: scale(20)
              }} source={closeIcon} />
            </TouchableOpacity>
            <View style={{
                // borderColor: "#FFA100",
                // borderWidth: 1,
                borderRadius: 10,
                padding: scale(15),
                marginTop: scale(30),
                backgroundColor:"#FFA500",
                alignItems:"center",
                justifyContent:"center",
                width:"100%",
                opacity:.7


              }}>
              <Text style={{
                color:"white",

              }}>
              {auth.email}
              </Text>
            </View>
              <CustomButtom
              loading={loading}
                buttonTextStyle={{ fontSize: scale(12) }}
                buttonstyle={{ width: "100%", borderColor: "#FFA100", padding: 15, backgroundColor: "#2E210A" }}
                onPress={() => isEnabled ? cb() : null}
                title={"Reset Password"}
              />
          </View>
        </View>
          </TouchableOpacity>
      </Modal>
    </View>
  );


}

export default CustomChangePasswordModal
