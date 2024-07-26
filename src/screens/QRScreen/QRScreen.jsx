import { Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { RNCamera } from 'react-native-camera';
import close from "./../../../assets/images/close.png";
import flashon from "./../../../assets/images/flashon.png";
import flashoff from "./../../../assets/images/flashoff.png";
import { scale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
const QRScreen = ({
}) => {
const navigation = useNavigation()
    const [torch, setTorch] = useState(false)

    onSuccess = e => {
        Alert.alert("QR Code", e.data);
    };
  return (
    <SafeAreaView style={{
        flex:1
    }}>
    <View style={{
        position: "relative",
        width: "100%",
        height: "100%"
    }}>
        <QRCodeScanner
            containerStyle={{
                backgroundColor: "black"
            }}
            reactivateTimeout={5000}
            fadeIn={true}
            showMarker={true}
            reactivate={true}
            onRead={onSuccess}
            flashMode={torch ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
            cameraStyle={{ width: '100%', height: '100%' }} // Making QR scanner full screen
            topContent={
                <Text>Scan the QR code from your computer.</Text>
            }
        />
        <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
                position: "absolute",
                top: 10,
                right: 10
            }}>
            <View>

                <Image source={close} style={{
                    width: scale(30),
                    height: scale(30)
                }} />
            </View>

        </TouchableOpacity>

        <TouchableOpacity
            onPress={() => setTorch(prev => !prev)}

            style={{
                position: "absolute",
                top: 10,
                left: 10
            }}>
            {torch ? <View>

                <Image source={flashoff} style={{
                    width: scale(30),
                    height: scale(30)
                }} />
            </View> : <View>

                <Image source={flashon} style={{
                    width: scale(30),
                    height: scale(30)
                }} />
            </View>}
        </TouchableOpacity>


    </View>
    </SafeAreaView>
  )
}

export default QRScreen

