import React, { useState } from 'react';
import { Modal, View, TouchableOpacity, Image, Alert } from 'react-native';
import { scale } from 'react-native-size-matters';
import DetailKeyValue from '../DetailKeyValue/DetailKeyValue';
// import Lightbox from 'react-native-lightbox';
import Lightbox from 'react-native-lightbox-v2';
import closeIcon from './../../../assets/images/close.png';
import { getFormattedName } from '../../../utils';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import ImageView from "react-native-image-viewing";

const UserDetailsModal = ({
  modalVisible = false,
  setModalVisible,
  email = '',
  name = '',
  profilePicture = '',
  number=''
  
}) => {
  const [lightBox, setLightBox] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [visible, setIsVisible] = useState(false)

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
            backgroundColor: 'rgba(33, 22, 10, .85)', // Black overlay with transparency
            width: '100%', // Ensure it covers the full screen width
            height: '100%', // Ensure it covers the full screen height
          }}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
             ""
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
                  borderWidth: scale(.5),
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

{/* <Lightbox
    activeProps={{
        resizeMode: 'contain',
        style: {
            width: '100%',
            height: scale(200),
            borderRadius: '100%',
        },
    }}
    // springConfig={{ tension: 30, friction: 7 }}
> */}
{/* {isLoading && (
        <SkeletonPlaceholder speed={1600}  backgroundColor='#2E210A'  highlightColor='#fff' >
          <SkeletonPlaceholder.Item              width={scale(50)}
            height={scale(50)}
            borderRadius={scale(50)}

            />
        </SkeletonPlaceholder>
      )}
      <TouchableOpacity onPress={()=>{setIsVisible(true)}}>

    <Image
        style={{
            resizeMode: 'cover',
            width: scale(50),
            height: scale(50),
            borderRadius: scale(100),
            opacity:isLoading?0:1,
            position:isLoading?"absolute":"relative",
        }}
        source={{ uri: profilePicture }}
        onLoad={() => setIsLoading(false)}

    />
      </TouchableOpacity> */}

{/* </Lightbox> */}
                  <DetailKeyValue Key="" style={{fontSize:scale(22)}} value={getFormattedName(name)} />
                    </View>
                  <DetailKeyValue Key="Email:" value={email} />
                  <DetailKeyValue Key="Number:" value={number} />

                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>
          <ImageView
  images={[{ uri: profilePicture }]}
  imageIndex={0}
  visible={visible}
  onRequestClose={() => setIsVisible(false)}
/>
        </View>
      )}
    </>
  );
};

export default UserDetailsModal;
