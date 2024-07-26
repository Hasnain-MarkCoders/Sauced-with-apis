import React, { useEffect, useState } from 'react'
import { Alert, Modal, StyleSheet, Text, Pressable, View, Image, TouchableOpacity } from 'react-native';
import close from "./../../../assets/images/close.png"
import { scale } from 'react-native-size-matters';
import closeIcon from "./../../../assets/images/close.png"
import CustomInput from '../CustomInput/CustomInput';
import { handleText } from '../../../utils';
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

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            margin: 20,
            borderWidth: scale(1),
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
      </Modal>
    </View>
  );


}

export default CustomConfirmModal
