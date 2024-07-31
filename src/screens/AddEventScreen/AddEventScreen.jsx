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

const AddEventScreen = () => {
    const [isKeyBoard, setIsKeyBoard] = useState(false)
    const [openDate, setOpenDate] = useState(false)
    const [alertModal, setAlertModal] = useState(false)
    const [points, setPoints]  = useState([])
    const [query, setQuery] = useState({
        title: "",
        eventOrganizer: "",
        date: new Date(),
        destinationTitle: "",
        destinationDetails: "",
        coordinates: ""
    });
    const navigation = useNavigation()
    const handleAddBullet=(value)=>{
        if (value.trim()){
            setPoints(prev=>[...prev, value])
            setQuery(prev=>({...prev, destinationDetails:""}))

        }
    }
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
    useEffect(()=>{
        console.log(query.date)
    },[query])

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
                        Add Event
                    </Text>
                    <View style={{
                        gap: scale(20),
                        flex: 1,
                        justifyContent: "space-between",
                    }}>

                        <View style={{
                            gap: scale(20)
                        }}>
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

                           

                            <CustomInput
                                // cb={() => setPage(1)}
                                name="destinationTitle"
                                onChange={handleText}
                                updaterFn={setQuery}
                                value={query.destinationTitle}
                                showTitle={false}
                                placeholder="Destination Title"
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
                            <View>

                                <CustomInput
                                    // cb={() => setPage(1)}
                                    name="destinationDetails"
                                    onChange={handleText}
                                    updaterFn={setQuery}
                                    value={query.destinationDetails}
                                    showTitle={false}
                                    placeholder="Destination Details"
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
                                <View style={{
                                    paddingLeft: scale(10),
                                    paddingTop: scale(20),
                                    gap:scale(10)
                                }}>
                                    {points.map((item, index)=>{
                                        return<CustomListItem text={item} />
                                        

                                    })}
                                </View>
                                <TouchableOpacity
                    onPress={() => {
                        // Linking.openURL(url)
                        // navigation.navigate("Checkin")
                        handleAddBullet(query.destinationDetails)

                    }}
                    style={{
                        paddingHorizontal: scale(10),
                        paddingVertical: scale(6),
                        backgroundColor: "#FFA100",
                        borderRadius: scale(5),
                        elevation: scale(5),
                        alignSelf: "flex-end",

                    }}>
                    <Text style={{
                        color: "black",
                        fontWeight: "700"

                    }}>{points.length<1?"Write a Point":"Add point"}</Text>


                </TouchableOpacity>

                            </View>




                            <CustomInput
                                // cb={() => {}}
                                name="coordinates"
                                onChange={handleText}
                                updaterFn={setQuery}
                                value={query.coordinates}
                                showTitle={false}
                                placeholder="Location Coordinates"
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

                            <CustomButtom
                                showIcon={false}
                                buttonTextStyle={{ fontSize: scale(14) }}
                                buttonstyle={{ width: "100%", borderColor: "#FFA100", backgroundColor: "#2e210a", paddingHorizontal: scale(15), paddingVertical: scale(13), display: "flex", flexDirection: "row-reverse", alignItems: "center", justifyContent: "center" }}
                                // onPress={() => {Vibration.vibrate(10) ;setAlertModal(true)}}
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
            </SafeAreaView>
        </ImageBackground>
    )
}

export default AddEventScreen
