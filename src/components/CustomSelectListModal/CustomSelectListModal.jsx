import React, { useState } from 'react'
import { Alert, Modal, StyleSheet, Text, Pressable, View, Image, TouchableOpacity } from 'react-native';
import close from "./../../../assets/images/close.png"
import { scale } from 'react-native-size-matters';
import closeIcon from "./../../../assets/images/close.png"
import CustomInput from '../CustomInput/CustomInput';
import { handleText } from '../../../utils';
import CustomButtom from '../CustomButtom/CustomButtom';
const CustomSelectListModal = ({
  modalVisible = false,
  setModalVisible = () => { },
  cb=()=>{},
  isEnabled=true,
  loading1=false,
  loading2=false,
  loading3=false,
    title1="",
    title2="",
    title3=""
}) => {

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
              loading={loading1}
                buttonTextStyle={{ fontSize: scale(12) }}
                buttonstyle={{ width: "100%", borderColor: "#FFA100", padding: 15, marginTop:scale(20),backgroundColor: "#2E210A" }}
                onPress={() => isEnabled ? cb(1) : null}
                title={title1}
              />
              
              <CustomButtom
              loading={loading2}
                buttonTextStyle={{ fontSize: scale(12) }}
                buttonstyle={{ width: "100%", borderColor: "#FFA100", padding: 15, marginTop:scale(20),backgroundColor: "#2E210A" }}
                onPress={() => isEnabled ? cb(2) : null}
                title={title2}
              />
               <CustomButtom
              loading={loading3}
                buttonTextStyle={{ fontSize: scale(12) }}
                buttonstyle={{ width: "100%", borderColor: "#FFA100", padding: 15, marginTop:scale(20),backgroundColor: "#2E210A" }}
                onPress={() => isEnabled ? cb(3) : null}
                title={title3}
              />
          </View>
        </View>
      </Modal>
    </View>
  );


}

export default CustomSelectListModal
