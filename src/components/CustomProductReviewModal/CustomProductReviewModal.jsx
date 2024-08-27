import React, { useEffect } from 'react'
import { Alert, Modal,  Text,  View, Image, TouchableOpacity } from 'react-native';
import { scale } from 'react-native-size-matters';
import closeIcon from "./../../../assets/images/close.png"
import { useNavigation, useRoute } from '@react-navigation/native';

const CustomProductReviewModal = (
    {
        modalVisible = false,
        setModalVisible = () => { },
        data={},
        userComeFrom=""
    }
) => {
    const navigation  = useNavigation()
    
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
              justifyContent: 'center',
              alignItems: 'center',
              width:"100%"
            }}>
              <View style={{
                borderWidth: scale(.5),
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
                      {data.title}  
                    </Text>

                    <Text style={{
                        color:"white",
                        fontSize:scale(12),
                        fontWeight:"500",
                        lineHeight:scale(24),
                        textAlign:"center"
                    }}>
                      {data.title} delivers intense, flavorful heat with a perfect balance of spice and tanginess. Ideal for adventurous taste buds.  
                    </Text>

                    <TouchableOpacity onPress={()=>{
                        setModalVisible(false)
                        navigation.navigate(userComeFrom=="review"?"ProductDetail":"AllCheckinsScreen",data)
                        
                    }}>

                    <Text style={{
                        color:"#FFA100",
                        fontSize:scale(12),
                        fontWeight:"500",
                        lineHeight:scale(24),
                        textAlign:"center",
                        textDecorationLine:"underline"
                    }}>
                                {
                                    userComeFrom=="review"?"Go to Product page":"See all check-ins"
                                }

                    
                    </Text>
                    </TouchableOpacity>
    
                </View>
              </View>
            </View>
              </TouchableOpacity>
          </Modal>
        </View>
      );
}

export default CustomProductReviewModal
