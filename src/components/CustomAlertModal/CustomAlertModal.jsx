import React, { useEffect } from 'react'
import { Alert, Modal,  Text,  View, Image, TouchableOpacity } from 'react-native';
import { scale } from 'react-native-size-matters';
import closeIcon from "./../../../assets/images/close.png"
import ErrorLogo from "./../../../assets/images/ErrorLogo.png"
import SuccessLogo from "./../../../assets/images/SuccessLogo.png"

import LinearGradient from 'react-native-linear-gradient';
const CustomAlertModal = ({
  modalVisible = false,
  setModalVisible = () => { },
  success=true,
  title="",
  cb=()=>{},
  buttonText=""
}) => {
  useEffect(()=>{
    // setTimeout(()=>{
    //   if(modalVisible){
    //     setModalVisible()
    //   }
    // },4000)
    console.log("title=========================>", title)
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
          <TouchableOpacity  style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                width:"100%",
                backgroundColor: 'rgba(33, 22, 10, .85)',
              }}
              activeOpacity={1}
              onPressOut={handleBackgroundTouch}>

        <View style={{
          flex: 1,
          width:"100%",
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <LinearGradient 
           colors={['#FFA100', '#FF7B00']}
          
          
          style={{
            position: "relative",
            backgroundColor: 'red',
            borderRadius: scale(10),
            padding: scale(20),
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
            display:"flex",
            alignItems:"center",
            justifyContent:"center"
          }}>
            
            <Image style={{
              width:scale(90),
              height:scale(90)
            }} source={success?SuccessLogo:ErrorLogo}/>
         
                <Text style={{
                    color:"white",
                    fontSize:scale(16),
                    fontWeight:400,
                    lineHeight:scale(25),
                    textAlign:"center"
                }}>
                  {title}  
                </Text>

                <TouchableOpacity
                
                onPress={()=>{
                  setModalVisible()
                  cb()
                }}
                style={{
                  backgroundColor:"white",
                  paddingHorizontal:scale(40),
                  paddingVertical:scale(15),
                  borderRadius:scale(8),
                  
}}>
                  <Text style={{
                    color:"#FFA100",
                    fontWeight:800,
                    fontSize:scale(14)
                  }}>
                 {buttonText?buttonText: "Close"}
                  </Text>
                </TouchableOpacity>

          </LinearGradient>
        </View>
          </TouchableOpacity>
      </Modal>
    </View>
  );


}

export default CustomAlertModal
