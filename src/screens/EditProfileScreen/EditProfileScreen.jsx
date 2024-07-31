import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, ImageBackground, ScrollView, Alert, Image } from 'react-native';
import home from './../../../assets/images/home.png';
import Header from '../../components/Header/Header';
import CustomButtom from '../../components/CustomButtom/CustomButtom';
import arrow from "./../../../assets/images/arrow.png";
import { useNavigation } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';
import { useDispatch, useSelector } from 'react-redux';
import { handleAuth } from '../../../android/app/Redux/userReducer';
import UploadImage from '../../components/UploadImage/UploadImage';
import useAxios from '../../../Axios/useAxios';
import CustomEditModal from '../../components/EditModal.jsx/EditModal';
import CustomChangePasswordModal from '../../components/CustomChangePasswordModal/CustomChangePasswordModal';

const EditProfileScreen = () => {
    const auth = useSelector(state => state.auth)
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isEnabled, setIsEnabled] = useState(true)
    const [value, setValue] = useState({ Name: auth?.name })
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const navigation = useNavigation()

    const dispatch = useDispatch()
    const axiosInstance = useAxios()



    const handleChangeName = async () => {
        try {
            setLoading(true)
            setIsEnabled(false)
            // await new Promise(resolve => setTimeout(resolve, 2000));
            await axiosInstance.patch("/change-name", { newName: value?.Name })
            dispatch(handleAuth({
                "name": value?.Name,
            }))
            setShowModal(false)
        } catch {
            console.log(error)
            Alert.alert(error.message || error.toString())
        }

        finally {
            setLoading(false)
            setIsEnabled(true)
            setShowModal(false)

        }
    };



    return (
        <ImageBackground style={{ flex: 1, width: '100%', height: '100%' }} source={home}>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    style={{ flex: 1 }}>
                    <Header showMenu={true} cb={() => navigation.goBack()} showProfilePic={false} showDescription={false} title="Edit profile" />
                    <View style={{ paddingHorizontal: 20, flex: 1, justifyContent: "space-between", paddingVertical: 40, paddingBottom: 100, gap: scale(10) }}>
                        <View style={{
                            marginBottom: scale(20)
                        }}>

                            <UploadImage />


                        </View>
                        <View style={{ alignItems: "center", gap: 20 }}>
                            <CustomButtom
                                Icon={() => <Image source={arrow} />}
                                showIcon={true}
                                buttonTextStyle={{ fontSize: scale(14) }}
                                buttonstyle={{ width: "100%", borderColor: "#FFA100", backgroundColor: "#2e210a", padding: 15, display: "flex", gap: 10, flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" }}
                                // onPress={() => setShowModal(true)}
                                title={"Edit Name"}
                            />
                            <CustomButtom
                                Icon={() => <Image source={arrow} />}
                                showIcon={true}
                                buttonTextStyle={{ fontSize: scale(14) }}
                                buttonstyle={{ width: "100%", borderColor: "#FFA100", backgroundColor: "#2e210a", padding: 15, display: "flex", gap: 10, flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" }}
                                // onPress={() => setShowPasswordModal(true)}
                                title={"Change Password"}
                            />

                        </View>
                    </View>
                    <CustomEditModal
                        isEnabled={isEnabled}
                        loading={loading}
                        initialValue={"hasnain"}
                        placeholder={"Change your name..."}
                        title={"Name"}
                        modalVisible={showModal} setModalVisible={setShowModal}
                        cb={handleChangeName}
                        setValue={setValue}
                        value={value?.Name}
                    />

                    <CustomChangePasswordModal
                        isEnabled={isEnabled}
                        loading={loading}
                        initialValue={"hasnain"}
                        placeholder={"Change your name..."}
                        title={"Name"}
                        modalVisible={showPasswordModal} setModalVisible={setShowPasswordModal}
                        cb={handleChangeName}
                        setValue={setValue}
                        value={value?.Name}
                    />
                </ScrollView>

            </SafeAreaView>
        </ImageBackground>
    );
};

export default EditProfileScreen;
