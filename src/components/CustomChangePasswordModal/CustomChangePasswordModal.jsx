import React, { useState } from 'react'
import { Alert, Modal, StyleSheet, Text, Pressable, View, Image, TouchableOpacity } from 'react-native';
import close from "./../../../assets/images/close.png"
import { scale } from 'react-native-size-matters';
import closeIcon from "./../../../assets/images/close.png"
import CustomInput from '../CustomInput/CustomInput';
import { handleText } from '../../../utils';
import CustomButtom from '../CustomButtom/CustomButtom';
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

            <CustomInput
              title={title}
              name={title}
              onChange={handleText}
              updaterFn={setValue}
              value={value}
              showTitle={true}
              placeholder={placeholder}
              containterStyle={{
                flexGrow: 1,
                paddingTop: scale(20)

              }}
              inputStyle={{
                borderColor: "#FFA100",
                borderWidth: 1,
                borderRadius: 10,
                padding: 15,
                marginTop: scale(10)

              }}
            />
              <CustomButtom
              loading={loading}
                buttonTextStyle={{ fontSize: scale(12) }}
                buttonstyle={{ width: "100%", borderColor: "#FFA100", padding: 15, backgroundColor: "#2E210A" }}
                onPress={() => isEnabled ? cb() : null}
                title={"Update"}
              />
          </View>
        </View>
      </Modal>
    </View>
  );


}

export default CustomChangePasswordModal
