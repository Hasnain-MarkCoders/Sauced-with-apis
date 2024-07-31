import React, {useEffect, useState} from 'react';
import {Alert, Modal, Text, View, Image, TouchableOpacity} from 'react-native';
import {scale} from 'react-native-size-matters';
import closeIcon from './../../../assets/images/close.png';
import DetailKeyValue from '../DetailKeyValue/DetailKeyValue';
import Lightbox from 'react-native-lightbox';
const UserDetailsModal = ({
  modalVisible = false,
  setModalVisible = () => {},
  email = '',
  name = '',
  prfilePicture = '',
}) => {
  const [LightBox, setLightBox] = useState(false);
  //   useEffect(()=>{
  //     setTimeout(()=>{
  //       if(modalVisible){
  //         setModalVisible()
  //       }
  //     },4000)
  //   },[modalVisible])

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
      }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              margin: 20,
              borderWidth: scale(1),
              borderColor: '#FFA100',
              borderRadius: scale(12),
              position: 'relative',
              backgroundColor: '#2E210A',
              borderRadius: 20,
              padding: scale(40),
              paddingVertical: scale(60),
              gap: scale(20),
              shadowColor: '#000',
              width: '90%',
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
                position: 'absolute',
                right: scale(20),
                top: scale(20),
              }}
              onPress={() => {
                setModalVisible(false);
              }}>
              <Image
                style={{
                  width: scale(30),
                  height: scale(30),
                }}
                source={closeIcon}
              />
            </TouchableOpacity>
            <View
              style={{
                gap: scale(10),
              }}>
              <Lightbox
               style={{
                width:LightBox?"100%": scale(50),
                borderRadius:scale(20)
              }}
                activeProps={{resizeMode: LightBox ? 'contain' : 'cover'}}
                springConfig={{tension: 30, friction: 7}}
                onOpen={() => setLightBox(true)}
                willClose={() => setLightBox(false)}
              
                >
                <Image
                  style={{
                    resizeMode: 'contain',
                    width:LightBox?"100%": scale(50),
                    height:LightBox?scale(200): scale(50),
                  }}
                  source={prfilePicture}
                />
              </Lightbox>

              <DetailKeyValue Key="Name : " value={name} />
              <DetailKeyValue Key="Email : " value={email} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default UserDetailsModal;
