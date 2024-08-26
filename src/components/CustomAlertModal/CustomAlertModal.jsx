import React, { useEffect } from 'react'
import { Alert, Modal,  Text,  View, Image, TouchableOpacity } from 'react-native';
import { scale } from 'react-native-size-matters';
import closeIcon from "./../../../assets/images/close.png"
const CustomAlertModal = ({
  modalVisible = false,
  setModalVisible = () => { },
  
  title="",
}) => {
  useEffect(()=>{
    // setTimeout(()=>{
    //   if(modalVisible){
    //     setModalVisible()
    //   }
    // },4000)
  },[modalVisible])
  const handleBackgroundTouch = () => {
    setModalVisible(false);
  };
  return (
    modalVisible && <View   style={{
      flex: 1,
      position:"absolute",
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
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
          <TouchableOpacity  style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              activeOpacity={1}
              onPressOut={handleBackgroundTouch}>

        <View style={{
          flex: 1,
          width:"100%",
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
            borderRadius: scale(10),
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
            minHeight:scale(200),
            display:"flex",
            alignItems:"center",
            justifyContent:"center"
          }}>
            {/* <TouchableOpacity

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
            </TouchableOpacity> */}
         
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
          </TouchableOpacity>
      </Modal>
    </View>
  );


}

export default CustomAlertModal
