import { ImageBackground, SafeAreaView, StyleSheet, ScrollView, Text, View, Keyboard, Alert, Vibration } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header/Header.jsx'
import home from './../../../assets/images/home.png';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { handleText, isURL } from '../../../utils.js';
import CustomInput from '../../components/CustomInput/CustomInput.jsx';
import CustomButtom from '../../components/CustomButtom/CustomButtom.jsx';
import CustomAlertModal from '../../components/CustomAlertModal/CustomAlertModal.jsx';
import useAxios from '../../../Axios/useAxios.js';
const RequestASauceScreen = () => {
    const axiosInstance = useAxios()
    const [isKeyBoard, setIsKeyBoard] = useState(false)
    const [loading , setLoading] = useState(false)
    const [alertModal, setAlertModal] = useState({
        open: false,
        message: "",
        success:true
    })
    const [query, setQuery] = useState({

        sauceName: "",
        brandName: "",
        webLink: "",
        name: "",
        title: "",
        description: "",

    });
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

    const handleRequestSauce = async() => {
        

    
        try{
            setLoading(true)

            if (!query?.sauceName) {
                setAlertModal({
                    open: true,
                    message: "Sauce name is required!",
                    success:false

                });
                return;
            }
    
           else if (!query?.brandName) {
                setAlertModal({
                    open: true,
                    message: "Brand name is required!",
                    success:false

                });
                return;
            }
    
           else if (query.webLink) {
            if(!isURL(query.webLink)){
                return setAlertModal({
                   open: true,
                   message: "Website link must be a valid URL!",
                   success:false

               });
               
            }
              
            }
            const response = await axiosInstance.post("/list-sauce", {
                sauceName:query.sauceName,
                brandName:query?.brandName,
                websiteLink:query?.webLink
            });


            if(response && response?.data &&  response?.data?.message){
                setAlertModal({
                    open: true,
                    message: response?.data.message,
                    success:true

                })
                setQuery({})
            }

        }catch(error){
            console.log(error)
            setAlertModal({
                open: true,
                message: error?.response?.data?.message || "An error occurred. Please try again.",
                success:false

            });
        }finally{
            setLoading(false)
        }
     
    }

    return (
        <ImageBackground style={{ flex: 1, width: '100%', height: '100%' }} source={home}>
            <SafeAreaView style={{ flex: 1, paddingBottom: isKeyBoard ? 0 : verticalScale(0) }}>
                <Header cb={() => navigation.goBack()}
                    showMenu={false}
                    showProfilePic={false} headerContainerStyle={{
                        paddingBottom: scale(20)
                    }} title={"Followers"} showText={false} />

                <View style={{
                    paddingHorizontal: scale(20),
                    paddingBottom: scale(20),
                    flex: 1
                }}>
                    <Text style={{
                        color: "white",
                        fontWeight: 600,
                        fontSize: scale(35),
                        lineHeight: scale(50),
                        marginBottom: scale(20)
                    }}>
                        Request Sauce
                    </Text>
                    <View style={{
                        gap: scale(20),
                        flex: 1,
                        justifyContent: "space-between",
                    }}>

                        <View style={{
                            gap: scale(20)
                        }}>
                            <View style={{
                                gap:scale(10)
                            }}>
                            <Text style={{
                                fontSize:scale(17),
                                color:"white"
                            }}>
                                Sauce Name *
                            </Text>
                            <CustomInput
                                // cb={() => setPage(1)}
                                name="sauceName"
                                onChange={handleText}
                                updaterFn={setQuery}
                                value={query.sauceName}
                                showTitle={false}
                                placeholder="e.g. Blazin’ Habanero Inferno"
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
                                <View style={{
                                gap:scale(10)
                            }}>
                                <Text style={{
                                fontSize:scale(17),
                                color:"white"
                            }}>
                                Brand Name *
                            </Text>
                            <CustomInput
                                // cb={() => setPage(1)}
                                name="brandName"
                                onChange={handleText}
                                updaterFn={setQuery}
                                value={query.brandName}
                                showTitle={false}
                                placeholder=" e.g. The Heat Exchange"
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


                                <View  style={{
                                gap:scale(10),
                                position:"relative"
                            }}>
                                <View style={{
                                    flexDirection:"row",
                                    alignItems:"center"
                                }}>

                                <Text style={{
                                fontSize:scale(17),
                                color:"white",
                                justifyContent:"center"}}>
                                Website Link 
                              
                            </Text>
                            <Text style={{
                                    color:"#FFA100",
                                    fontSize:scale(8)
                                }}> (Optional)</Text>

                                </View>
                            <View style={{
                                gap: scale(10)
                            }}>

                                <CustomInput
                                    // cb={() => setPage(1)}
                                    name="webLink"
                                    onChange={handleText}
                                    updaterFn={setQuery}
                                    value={query.webLink}
                                    showTitle={false}
                                    placeholder="e.g. https://example.com"
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
                                {/* <Text style={{
                                    color: "#FFA100",
                                    alignSelf: "flex-end",
                                    fontSize: scale(10)
                                }}>Web-Link Optional</Text> */}
                            </View>
                                </View>
                        </View>
                        <View>

                            <CustomButtom
                            loading={loading}
                                showIcon={false}
                                buttonTextStyle={{ fontSize: scale(14) }}
                                buttonstyle={{ width: "100%", borderColor: "#FFA100", backgroundColor: "#2e210a", paddingHorizontal: scale(15), paddingVertical: scale(13), display: "flex", flexDirection: "row-reverse", alignItems: "center", justifyContent: "center" }}
                                // onPress={() => {Vibration.vibrate(10) ;setAlertModal(true)}}
                                onPress={handleRequestSauce}
                                title={"Submit"}
                            />
                        </View>
                    </View>
                </View>




                <CustomAlertModal
                    success={alertModal?.success}
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

export default RequestASauceScreen
