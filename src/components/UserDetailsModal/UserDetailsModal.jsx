import React, { useState } from 'react';
import { Modal, View, TouchableOpacity, Image, Alert } from 'react-native';
import { scale } from 'react-native-size-matters';
import DetailKeyValue from '../DetailKeyValue/DetailKeyValue';
import Lightbox from 'react-native-lightbox';
import closeIcon from './../../../assets/images/close.png';

const UserDetailsModal = ({
  modalVisible = false,
  setModalVisible,
  email = '',
  name = '',
  profilePicture = '',
  number=''
  
}) => {
  const [lightBox, setLightBox] = useState(false);

  // Handler to close the modal if the background is touched
  const handleBackgroundTouch = () => {
    setModalVisible(false);
  };
  return (
    <>
      {modalVisible && (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            backgroundColor: 'rgba(0,0,0,0.5)', // Black overlay with transparency
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
            <TouchableOpacity
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              activeOpacity={1}
              onPressOut={handleBackgroundTouch}>
              <TouchableOpacity
                activeOpacity={1}
                style={{
                  margin: 20,
                  borderWidth: scale(1),
                  borderColor: '#FFA100',
                  borderRadius: scale(12),
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
                }}
                onPress={e => e.stopPropagation()}>
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
                    <View style={{
                      flexDirection:"row",gap:scale(20),
                      alignItems:"center",
                      marginBottom:scale(20)
                    }}>

                  <Lightbox
                    style={{
                      width: lightBox ? '100%' : scale(50),
                      borderRadius: scale(20),
                    }}
                    activeProps={{ resizeMode: lightBox ? 'contain' : 'cover' }}
                    springConfig={{ tension: 30, friction: 7 }}
                    onOpen={() => setLightBox(true)}
                    willClose={() => setLightBox(false)}>
                       <Image
                  style={{
                    resizeMode: 'contain',
                    width:lightBox?"100%": scale(50),
                    borderRadius:lightBox?"100%": scale(50),
                    height:lightBox?scale(200): scale(50),
                  }}
                  source={{uri:profilePicture}}
                />
                  </Lightbox>
                  <DetailKeyValue Key="" style={{fontSize:scale(22)}} value={name} />
                    </View>
                  <DetailKeyValue Key="Email:" value={email} />
                  <DetailKeyValue Key="Number:" value={number} />

                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>
        </View>
      )}
    </>
  );
};

export default UserDetailsModal;
