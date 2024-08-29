import { ImageBackground, SafeAreaView, StyleSheet, Image,ScrollView, Text, View, Keyboard, Alert, Vibration, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header/Header.jsx'
import home from './../../../assets/images/home.png';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { handleText } from '../../../utils.js';
import CustomInput from '../../components/CustomInput/CustomInput.jsx';
import CustomButtom from '../../components/CustomButtom/CustomButtom.jsx';
import CustomListItem from '../../components/CustomListItem/CustomListItem.jsx';
import DatePicker from 'react-native-date-picker'
import arrow from "./../../../assets/images/arrow.png";
import CustomAlertModal from '../../components/CustomAlertModal/CustomAlertModal.jsx';
import useAxios from '../../../Axios/useAxios.js';
import axios from 'axios';

const AddEventScreen = () => {
    const [isKeyBoard, setIsKeyBoard] = useState(false)
    const [openDate, setOpenDate] = useState(false)
    const [alertModal, setAlertModal] = useState({
        open: false,
        message: ""
    })
    const [query, setQuery] = useState({
        title: "",
        eventOrganizer: "",
        date: new Date(),
        address: "",
        destinationDetails: "",
        coordinates: ""
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

    const handleAddEvent=async()=>{
        if (!query?.title) {
            return setAlertModal({
                open: true,
                message: "Title is required!"
            })

        }

        // else if (!query?.eventOrganizer) {
        //     return setAlertModal({
        //         open: true,
        //         message: "Event Organizer is required!"
        //     })

        // }


        // else if (!query?.date) {
        //     return setAlertModal({
        //         open: true,
        //         message: "Date is required!"
        //     })

        // }


        else if (!query?.address) {
            return setAlertModal({
                open: true,
                message: "Address is required!"
            })

        }


        // else if (!query?.destinationDetails) {
        //     return setAlertModal({
        //         open: true,
        //         message: "Details is required!"
        //     })

        // }

        // else if (!query?.coordinates) {
        //     return setAlertModal({
        //         open: true,
        //         message: "coordinates are required!"
        //     })

        // }
        
            try{

                
        const res = await axiosInstance.post("/request-event", {
            "eventName": query?.title,
            "eventDetails": query?.destinationDetails,
            "eventDate": query?.date,
            "venueName": query?.address,
            "venueDescription": query?.destinationDetails,
            "venueLocation.longitude": "12.4964",
            "venueLocation.latitude": "41.9028"
        }
        )
         console.log("<==============================================res============================================>", res.data)
            }catch(error){
                console.log(error)

            }




    }





    return (
        <ImageBackground style={{ flex: 1, width: '100%', height: '100%' }} source={home}>
            <SafeAreaView style={{ flex: 1, paddingBottom: isKeyBoard ? 0 : verticalScale(0) }}>
                <ScrollView>

                <Header cb={() => navigation.goBack()}
                    showMenu={false}
                    showProfilePic={false} headerContainerStyle={{
                        paddingBottom: scale(20)
                    }} title={""} showText={false} />

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
                        Add Events
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
                                Title
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
                            <View style={{
                                gap:scale(10)
                            }}>
                            <Text style={{
                                fontSize:scale(17),
                                color:"white"
                            }}>
                                Event Organizer
                            </Text>
                            <CustomInput
                                // cb={() => setPage(1)}
                                name="eventOrganizer"
                                onChange={handleText}
                                updaterFn={setQuery}
                                value={query.eventOrganizer}
                                showTitle={false}
                                placeholder="Event Organizer"
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
                                Date
                            </Text>
                                    <CustomButtom
                                    Icon={() => <Image source={arrow} />}
                                    showIcon={false}
                                    buttonTextStyle={{ fontSize: scale(14) }}
                                    buttonstyle={{ width: "100%", borderColor: "#FFA100", backgroundColor: "#2e210a", padding: 15, display: "flex", gap: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
                                    onPress={() => {
                                        Vibration.vibrate(10);
                                        // navigation.navigate("SauceDetails")
                                        setOpenDate(true)
                                    }}
                                    title={query.date.toDateString()}
                                />
                                    </View>

                           
                                    <View style={{
                                gap:scale(10)
                            }}>
                                    <Text style={{
                                fontSize:scale(17),
                                color:"white"
                            }}>
                                Address
                            </Text>
                            <CustomInput
                                // cb={() => setPage(1)}
                                name="address"
                                onChange={handleText}
                                updaterFn={setQuery}
                                value={query.address}
                                showTitle={false}
                                placeholder="Address"
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
                            <View>
                                <View style={{
                                gap:scale(10)
                            }}>
                                <Text style={{
                                fontSize:scale(17),
                                color:"white"
                            }}>
                                Details
                            </Text>
                                <CustomInput
                                    // cb={() => setPage(1)}
                                    multiline={true}
                                    numberOfLines={5}
                                    name="destinationDetails"
                                    onChange={handleText}
                                    updaterFn={setQuery}
                                    value={query.destinationDetails}
                                    showTitle={false}
                                    placeholder="Details"
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
            textAlignVertical:"top"



                                    }} />
                                </View>
                            </View>



                                    <View style={{
                                gap:scale(10)
                            }}>
                                    <Text style={{
                                fontSize:scale(17),
                                color:"white"
                            }}>
                                Location
                            </Text>
                            <CustomInput
                                // cb={() => {}}
                                name="coordinates"
                                onChange={handleText}
                                updaterFn={setQuery}
                                value={query.coordinates}
                                showTitle={false}
                                placeholder="Location"
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

                        </View>
                        <View>

                            <CustomButtom
                                showIcon={false}
                                buttonTextStyle={{ fontSize: scale(14) }}
                                buttonstyle={{ width: "100%", borderColor: "#FFA100", backgroundColor: "#2e210a", paddingHorizontal: scale(15), paddingVertical: scale(13), display: "flex", flexDirection: "row-reverse", alignItems: "center", justifyContent: "center" }}
                                // onPress={() => {Vibration.vibrate(10) ;setAlertModal(true)}}
                                onPress={handleAddEvent}
                                title={"Submit"}
                            />
                        </View>
                    </View>
                </View>
                </ScrollView>
                 <DatePicker
                modal
                open={openDate}
                date={new Date()}

        onConfirm={(date) => {
            setOpenDate(false)
          setQuery(prev=>({...prev, date:date}))
        }}
        onCancel={() => {
            setOpenDate(false)
        }}
      />


<CustomAlertModal
                    title={alertModal?.message}
                    modalVisible={alertModal?.open}
                    setModalVisible={() => setAlertModal({
                        alertModal: false,
                        messsage: ""
                    })}
                />
            </SafeAreaView>
        </ImageBackground>
    )
}

export default AddEventScreen
