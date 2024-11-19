import React, { useState } from 'react'
import { Alert, Modal, StyleSheet, Text, Pressable, View, Image, TouchableOpacity } from 'react-native';
import close from "./../../../assets/images/close.png"
import { scale } from 'react-native-size-matters';
import closeIcon from "./../../../assets/images/close.png"
import CustomInput from '../CustomInput/CustomInput';
import { handleText } from '../../../utils';
import CustomButtom from '../CustomButtom/CustomButtom';
const CustomEditModal = ({
    modalVisible = false,
    setModalVisible = () => { },
    title = "",
    cb = () => { },
    url,
    description

}) => {
    const handleBackgroundTouch = () => {
        setModalVisible(false);
    };
    return (
        modalVisible && <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            width: '100%',
            height: '100%',
        }}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <TouchableOpacity

                    style={{
                        flex: 1,
                        width: "100%",
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(33, 22, 10, .85)',

                    }}
                    activeOpacity={1}
                    onPressOut={handleBackgroundTouch}
                >

                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: "100%"
                    }}>
                        <View style={{
                            margin: 20,
                            borderWidth: scale(.5),
                            borderColor: "#FFA100",
                            borderRadius: scale(12),
                            position: "relative",
                            backgroundColor: '#2E210A',
                            borderRadius: 20,
                            padding: 35,
                            gap: scale(20),
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
                            <Image style={{
                                borderRadius: 100 / 2,
                                width: scale(90),
                                height: scale(90),
                                alignSelf: "center"
                            }} source={{ uri: url }} />
                            <Text style={{
                                color: "white",
                                fontSize: scale(15),
                                fontWeight: 500,
                                lineHeight: scale(25),
                                textAlign: "center"
                            }}>

                                {
                                    title?title:"Name : N/A"
                                }</Text>
                            <Text style={{
                                color: "white",
                                fontSize: scale(12),
                                fontWeight: 400,
                                lineHeight: scale(25),
                                textAlign: "center"
                            }}>
                            {
                                description?description:"Description : N/A"
                            }
                            </Text>
                            <CustomButtom
                            onPress={handleBackgroundTouch}
                                buttonTextStyle={{ fontSize: scale(12) }}
                                buttonstyle={{ width: "50%", borderColor: "#FFA100", margin: "auto", padding: 15, backgroundColor: "#2E210A" }}
                                title={"Close"}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );


}

export default CustomEditModal
