import React, { memo, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { scale } from 'react-native-size-matters';
import { useDispatch, useSelector } from 'react-redux';
import { launchImageLibrary } from 'react-native-image-picker';
import { handleAuth } from '../../../android/app/Redux/userReducer';
import useAxios from '../../../Axios/useAxios';
import CustomAlertModal from '../CustomAlertModal/CustomAlertModal';

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
            console.log("response?.data?.message======================>", response?.data?.message)
            setAlertModal({
                open: true,
                message: response?.data?.message,
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

    const handleImagePicker = () => {
        const options = {
            mediaType: 'photo',
            maxWidth: 300,
            maxHeight: 300,
            quality: 1,
        };

        try {
            launchImageLibrary(options, response => {
                if (response.didCancel) {
                    console.log("User cancelled image picker");
                } else if (response.errorCode) {
                    console.log('ImagePicker Error: ', response.errorMessage);
                } else if (response.assets && response.assets.length > 0) {
                    const asset = response.assets[0];
                    const source = { uri: asset.uri };
                    setImageUri(source.uri);
                    const file = {
                        uri: asset.uri,
                        type: asset.type,
                        name: asset.fileName,
                    };
                    handleImage(source.uri, file);
                } else {
                    console.log("Unexpected response from image picker");
                }
            });
        } catch (error) {
            console.error("Error during image selection: ", error);
            setAlertModal({
                open: true,
                message: error.message,
                success: false,
                openYesNoModal: false
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
