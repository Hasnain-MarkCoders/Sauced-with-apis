import { ImageBackground, SafeAreaView, StyleSheet, ScrollView, Text, View, Keyboard, Alert, Vibration } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header/Header.jsx'
import home from './../../../assets/images/home.png';
import { scale, verticalScale } from 'react-native-size-matters';
import { UNSPLASH_URL, VITE_UNSPLASH_ACCESSKEY } from "@env"
import axios from 'axios';
import FollowersList from '../../components/FollowersList/FollowersList.jsx';
import { useNavigation } from '@react-navigation/native';
import { handleText } from '../../../utils.js';
import CustomInput from '../../components/CustomInput/CustomInput.jsx';
import { FlatList } from 'react-native-gesture-handler';
import CustomButtom from '../../components/CustomButtom/CustomButtom.jsx';
import CustomAlertModal from '../../components/CustomAlertModal/CustomAlertModal.jsx';
import useAxios from '../../../Axios/useAxios.js';
const SouceDetails = () => {
    const [isKeyBoard, setIsKeyBoard] = useState(false)
    const [loading, setLoading] = useState(false)
    const [alertModal, setAlertModal] = useState({
        open: false,
        message: ""
    })
    const [query, setQuery] = useState({
        name: "",
        title: "",
        description: "",

    });
    const axiosInstance = useAxios()
    const navigation = useNavigation()
    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            setIsKeyBoard(true)
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setIsKeyBoard(false)
        });
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);


    const handleRequestSauce = async () => {
        try {
            setLoading(true)

            if (!query?.name) {
                return setAlertModal({
                    open: true,
                    message: "Sauce name is required!"
                })
            }
            else if (!query?.title) {
                return setAlertModal({
                    open: true,
                    message: "Title is required!"
                })
            }

            else if (!query?.description) {
                return setAlertModal({
                    open: true,
                    message: "Description is required!"
                })
            }
            const response = await axiosInstance.post("/request-sauce", {
                name: query.name,
                title: query?.title,
                description: query?.description,

            });


            if (response && response?.data && response?.data?.message) {
                setAlertModal({
                    open: true,
                    message: response?.data.message
                })
                setQuery({})
            }

        } catch (error) {
            console.log(error)
            setAlertModal({
                open: true,
                message: error?.response?.data?.message || "An error occurred. Please try again."
            });
        } finally {
            setLoading(false)
        }

    }



    return (
        <ImageBackground style={{ flex: 1, width: '100%', height: '100%' }} source={home}>
            <SafeAreaView style={{ flex: 1, paddingBottom: isKeyBoard ? 0 : verticalScale(0) }}>
                <Header cb={() => navigation.navigate("Home")}
                    showMenu={false}
                    showProfilePic={false} headerContainerStyle={{
                        paddingBottom: scale(20)
                    }} title={"Followers"} showText={false} />
                <FlatList
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    data={[1, 1]}
                    renderItem={({ item, index }) => {
                        return (
                            <View style={{
                                flex: 1,

                                paddingHorizontal: scale(20)

                            }}>
                                {index == 0 && <View style={{
                                    marginBottom: scale(20)
                                }}>
                                    <Text style={{
                                        color: "white",
                                        fontWeight: 600,
                                        fontSize: scale(35),
                                        lineHeight: scale(50),
                                        marginBottom: scale(20)
                                    }}>
                                        Sauce Details
                                    </Text>
                                    <View style={{
                                        gap: scale(20)
                                    }}>


                                        <View
                                            style={{
                                                gap: scale(10)
                                            }}
                                        >
                                            <Text style={{
                                                fontSize: scale(17),
                                                color: "white"
                                            }}>
                                                Sauce Name
                                            </Text>
                                            <CustomInput
                                                // cb={() => setPage(1)}
                                                name="name"
                                                onChange={handleText}
                                                updaterFn={setQuery}
                                                value={query.name}
                                                showTitle={false}
                                                placeholder="Sauce Name"
                                                containterStyle={{
                                                    flexGrow: 1,
                                                }}
                                                inputStyle={{
                                                    borderColor: "#FFA100",
                                                    backgroundColor: "#2e210a",
                                                    color: "white",
                                                    borderWidth: 1,
                                                    borderRadius: 10,
                                                    padding: 15,

                                                }} />
                                        </View>

                                        <View

                                            style={{
                                                gap: scale(10)
                                            }}
                                        >
                                            <Text style={{
                                                fontSize: scale(17),
                                                color: "white"
                                            }}>
                                                Sauce Title
                                            </Text>

                                            <CustomInput
                                                // cb={() => setPage(1)}
                                                name="title"
                                                onChange={handleText}
                                                updaterFn={setQuery}
                                                value={query.title}
                                                showTitle={false}
                                                placeholder="Title"
                                                containterStyle={{
                                                    flexGrow: 1,
                                                }}
                                                inputStyle={{
                                                    borderColor: "#FFA100",
                                                    backgroundColor: "#2e210a",
                                                    color: "white",
                                                    borderWidth: 1,
                                                    borderRadius: 10,
                                                    padding: 15,

                                                }} />
                                        </View>
                                        <View

                                            style={{
                                                gap: scale(10)
                                            }}
                                        >
                                            <Text style={{
                                                fontSize: scale(17),
                                                color: "white"
                                            }}>
                                                Sauce Description
                                            </Text>
                                            <CustomInput
                                                multiline={true}
                                                numberOfLines={10}
                                                // cb={() => setPage(1)}
                                                name="description"
                                                onChange={handleText}
                                                updaterFn={setQuery}
                                                value={query.description}
                                                showTitle={false}
                                                placeholder="Description"
                                                containterStyle={{
                                                    flexGrow: 1,
                                                }}
                                                inputStyle={{
                                                    borderColor: "#FFA100",
                                                    backgroundColor: "#2e210a",
                                                    color: "white",
                                                    borderWidth: 1,
                                                    borderRadius: 10,
                                                    padding: 15,
                                                    textAlignVertical: 'top',

                                                }} />
                                        </View>

                                        <CustomButtom
                                            loading={loading}
                                            showIcon={false}
                                            buttonTextStyle={{ fontSize: scale(14) }}
                                            buttonstyle={{ width: "100%", marginTop: scale(60), borderColor: "#FFA100", backgroundColor: "#2e210a", paddingHorizontal: scale(15), paddingVertical: scale(13), display: "flex", gap: 10, flexDirection: "row-reverse", alignItems: "center", justifyContent: "center" }}
                                            // onPress={() => {Vibration.vibrate(10) ;setAlertModal(true)}}
                                            onPress={handleRequestSauce}
                                            title={"Submit"}
                                        />
                                    </View>

                                </View>}

                            </View>

                        )
                    }}
                />
                <CustomAlertModal
                    title={alertModal?.message}
                    modalVisible={alertModal?.open}
                    setModalVisible={() => setAlertModal({
                        open: false,
                        messsage: ""
                    })}
                />
            </SafeAreaView>
        </ImageBackground>
    )
}

export default SouceDetails

const styles = StyleSheet.create({
    separator: {
        marginRight: scale(20),
    }

})