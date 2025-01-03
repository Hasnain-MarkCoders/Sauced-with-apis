import React, { memo, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Alert, Platform } from 'react-native';
import { scale } from 'react-native-size-matters';
import { useDispatch, useSelector } from 'react-redux';
import { launchImageLibrary } from 'react-native-image-picker';
// import { handleAuth } from '../../../android/app/Redux/userReducer';
import useAxios from '../../../Axios/useAxios';
import CustomAlertModal from '../CustomAlertModal/CustomAlertModal';
import { handleAuth } from '../../Redux/userReducer';

const UploadImage = () => {
    const auth = useSelector(state => state?.auth);
    const [imageUri, setImageUri] = useState(auth?.url);
    const dispatch = useDispatch();
    const axiosInstance = useAxios();

    const [alertModal, setAlertModal] = useState({
        open: false,
        message: "",
        success: true,
        openYesNoModal: false
    });

    const handleImage = async (url, file) => {
        try {
            const data = new FormData();
            data.append('image', file);

            const response = await axiosInstance.post("/change-image", data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            dispatch(handleAuth({ url }));
            setImageUri(url);
            setAlertModal({
                open: true,
                message: response?.data?.message||"Image uploaded successfully.",
                success: true,
                openYesNoModal: false
            });
        } catch (error) {
            console.error("Failed to upload image: ", error);
            setAlertModal({
                open: true,
                message: error.message,
                success: false,
                openYesNoModal: false
            });
        }
    };

    const handleImagePicker = async () => {
        const options = {
          mediaType: 'photo',
          maxWidth: 300,
          maxHeight: 300,
          quality: 1,
        };
      
        try {
          const response = await launchImageLibrary(options);
      
          if (response.didCancel) {
          } else if (response.errorCode) {
            setAlertModal({
              open: true,
              message: response.errorMessage || 'Something went wrong while picking the image.',
              success: false,
              openYesNoModal: false,
            });
          } else if (response.assets && response.assets.length > 0) {
            const asset = response.assets[0];
      
            // Adjust URI for platform differences
            let uri = asset.uri;
            if (Platform.OS === 'android' && !uri.startsWith('file://')) {
              uri = 'file://' + uri;
            }
      
            // Extract filename and extension
            const filename = asset.fileName || `photo_${Date.now()}.jpg`;
            const extension = filename.split('.').pop().toLowerCase();
      
            // Determine MIME type with fallback
            const mimeTypes = {
              jpg: 'image/jpeg',
              jpeg: 'image/jpeg',
              png: 'image/png',
              // Add more types if needed
            };
            const type = mimeTypes[extension] || asset.type || 'image/jpeg';
      
            // Create the file object
            const file = {
              uri: uri,
              type: type,
              name: filename,
            };
      
            // Update state or call the handler
            setImageUri(uri);
            handleImage(uri, file);
          } else {
            setAlertModal({
              open: true,
              message: 'No image was selected. Please try again.',
              success: false,
              openYesNoModal: false,
            });
          }
        } catch (error) {
          console.error('Error during image selection: ', error);
          setAlertModal({
            open: true,
            message: error.message || 'An unexpected error occurred during image selection.',
            success: false,
            openYesNoModal: false,
          });
        }
      };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleImagePicker}>
                <Image
                    style={styles.image}
                    source={{ uri: imageUri || 'default-placeholder-image-uri-here' }}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleImagePicker}>
                <Text style={styles.text}>Change Profile Picture</Text>
            </TouchableOpacity>
            <CustomAlertModal
                success={alertModal?.success}
                title={alertModal?.message}
                modalVisible={alertModal?.open}
                setModalVisible={() => setAlertModal({
                    open: false,
                    message: ""
                })}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        alignItems: "center",
        gap: scale(10),
        borderRadius: scale(12),
        borderColor: "#FFA100",
        borderWidth: scale(1),
        padding: scale(20),
    },
    image: {
        width: scale(100),
        height: scale(100),
        borderRadius: scale(50),
        borderColor: "#FFA100",
        borderWidth: scale(1),
    },
    text: {
        color: "#FFA100",
        textDecorationLine: "underline",
        fontSize: scale(12),
        lineHeight: scale(25),
    },
});

export default memo(UploadImage);
