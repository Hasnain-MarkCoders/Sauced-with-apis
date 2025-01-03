import React, { useEffect } from 'react'
import {  Modal, Pressable, View, Image, TouchableOpacity } from 'react-native';
import { scale } from 'react-native-size-matters';
import closeIcon from "./../../../assets/images/close.png"
import CustomButtom from '../CustomButtom/CustomButtom';
const CustomConfirmModal = ({
  modalVisible = false,
  setModalVisible = () => { },
  cb=()=>{},
  isEnabled=true,
  loading=false,
    title=""
}) => {

  useEffect(()=>{
    if(modalVisible){
      setTimeout(()=>{
        setModalVisible()
      },3000)
    }

  },[modalVisible])
  const handleBackgroundTouch = () => {
    setModalVisible(false);
  };
  return (
   modalVisible && <View style={{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: 'rgba(33, 22, 10, .85)', // Black overlay with transparency
    width: '100%', // Ensure it covers the full screen width
    height: '100%', // Ensure it covers the full screen height
  }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
       
          setModalVisible(!modalVisible);
        }}>
          <TouchableOpacity style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              activeOpacity={1}
              onPressOut={handleBackgroundTouch}>

        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
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
              <CustomButtom
              loading={loading}
                buttonTextStyle={{ fontSize: scale(12) }}
                buttonstyle={{ width: "100%", borderColor: "#FFA100", padding: 15, marginTop:scale(20),backgroundColor: "#2E210A" }}
                onPress={() => isEnabled ? cb() : null}
                title={title}
              />
          </View>
        </View>
          </TouchableOpacity>
      </Modal>
    </View>
  );


}

export default CustomConfirmModal
