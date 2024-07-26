import React, { useEffect, useState } from 'react'
import { Alert, Modal, StyleSheet, Text, Pressable, View, Image, TouchableOpacity } from 'react-native';
import close from "./../../../assets/images/close.png"
import { scale } from 'react-native-size-matters';
import closeIcon from "./../../../assets/images/close.png"
import CustomInput from '../CustomInput/CustomInput';
import { handleText } from '../../../utils';
import CustomButtom from '../CustomButtom/CustomButtom';
const CustomAlertModal = ({
  modalVisible = false,
  setModalVisible = () => { },
  
  title="",
}) => {
  useEffect(()=>{
    setTimeout(()=>{
      if(modalVisible){
        setModalVisible()
      }
    },4000)
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
            padding: scale(40),
            paddingVertical:scale(60),
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
            }}>
                <Text style={{
                    color:"white",
                    fontSize:scale(20),
                    fontWeight:700,
                    lineHeight:scale(50),
                    textAlign:"center"
                }}>
                  {title}  
                </Text>

            </View>
          </View>
        </View>
      </Modal>
    </View>
  );


}

export default CustomAlertModal
