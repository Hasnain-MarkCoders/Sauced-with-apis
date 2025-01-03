import React, { useEffect, useState } from 'react'
import { Alert, Modal,  Text,  View, Image, TouchableOpacity } from 'react-native';
import { scale } from 'react-native-size-matters';
import QuestionMark from "./../../../assets/images/question-mark.png"
import ErrorLogo from "./../../../assets/images/ErrorLogo.png"

import SuccessLogo from "./../../../assets/images/SuccessLogo.png"
import LinearGradient from 'react-native-linear-gradient';
import CustomInput from '../CustomInput/CustomInput';
import { handleText } from '../../../utils';
const ModalWithInput = ({
  modalVisible = false,
  setModalVisible = () => { },
  success=true,
  title="",
  cb=()=>{},
  setInput=()=>{},
  input="",
  placeholder="",
  loading=false
}) => {

  const handleBackgroundTouch = () => {
    setModalVisible(prev=>({...prev, open:false}));
   
  };
  const [query, setQuery]= useState({
    email:""
  })
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
          // setModalVisible(!modalVisible);
         
        }}>
          <TouchableOpacity  style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                width:"100%",
                backgroundColor: 'rgba(33, 22, 10, .85)',
              }}
              activeOpacity={1}
              onPressOut={handleBackgroundTouch}
              >

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
            }} source={success?SuccessLogo:QuestionMark}/>
         
                <Text style={{
                    color:"white",
                    fontSize:scale(20),
                    fontWeight:400,
                    lineHeight:scale(25),
                    textAlign:"center"
                }}>
                  {title}  
                </Text>

                <CustomInput
                                          imageStyles={{top:"50%", transform: [{ translateY: -0.5 * scale(25) }], resizeMode: 'contain',width:scale(25), height:scale(25), aspectRatio:"1/1"}}
                                          isURL={false}
                                          showImage={false}
                                          // uri={search}
                                            // cb={() => setPage(1)}
                                            name="email"
                                            onChange={handleText}
                                            updaterFn={setQuery}
                                            value={query.email}
                                            showTitle={false}
                                            placeholder={placeholder}
                                            containterStyle={{
                                                flexGrow: 1,
                                                width:"100%"
                                            }}
                                            inputStyle={{
                                                borderColor: "white",
                                                borderWidth: 1,
                                                borderRadius: 10,
                                                padding: scale(15),
                                                paddingVertical:scale(15)
                                                // paddingLeft:scale(45),
                                                // width:"100%"

                                            }} />
                  <View style={{
                    flexDirection:"row",
                    gap:scale(20),
                    alignItems:"center"
                  }}>

                <TouchableOpacity
                disabled={loading}
                onPress={()=>{
                  setModalVisible(prev=>({...prev, open:false}))
                 
                
                }}
                style={{
                  backgroundColor:"white",
                  paddingHorizontal:scale(30),
                  paddingVertical:scale(15),
                  borderRadius:scale(8),
                  
}}>
                  <Text style={{
                    color:"#FFA100",
                    fontWeight:800,
                    fontSize:scale(14)
                  }}>
                  Close
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                disabled={loading}
                
                onPress={()=>{
                  cb(query.email, setQuery)
                  // setModalVisible(false)
                
                }}
                style={{
                  backgroundColor:"white",
                  paddingHorizontal:scale(30),
                  paddingVertical:scale(15),
                  borderRadius:scale(8),
                  
}}>
                  <Text style={{
                    color:"#FFA100",
                    fontWeight:800,
                    fontSize:scale(14)
                  }}>
                  Yes
                  </Text>
                </TouchableOpacity>
                  </View>


          </LinearGradient>
        </View>
          </TouchableOpacity>
      </Modal>
    </View>
  );


}

export default ModalWithInput
