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
const SouceDetails = () => {
    const [isKeyBoard, setIsKeyBoard]= useState(false)
    const [alertModal,setAlertModal ] = useState(false)
    const [query, setQuery] = useState({
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

    return (
        <ImageBackground style={{ flex: 1, width: '100%', height: '100%' }} source={home}>
            <SafeAreaView style={{ flex: 1, paddingBottom: isKeyBoard ? 0 :verticalScale(0) }}>
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
                                        gap:scale(20)
                                    }}>
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
                                            color:"white",
                                            borderWidth: 1,
                                            borderRadius: 10,
                                            padding: 15,

                                        }} />
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
                                            color:"white",
                                            borderWidth: 1,
                                            borderRadius: 10,
                                            padding: 15,

                                        }} />
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
                                            color:"white",
                                            borderWidth: 1,
                                            borderRadius: 10,
                                            padding: 15,
                                            textAlignVertical: 'top', 

                                        }} />

                                         <CustomButtom
                                showIcon={false}
                                buttonTextStyle={{ fontSize: scale(14) }}
                                buttonstyle={{ width: "100%",marginTop:scale(60), borderColor: "#FFA100", backgroundColor: "#2e210a", paddingHorizontal: scale(15), paddingVertical:scale(13), display: "flex", gap: 10, flexDirection: "row-reverse", alignItems: "center", justifyContent: "center" }}
                                // onPress={() => {Vibration.vibrate(10) ;setAlertModal(true)}}
                                title={"Submit"}
                            />
                                    </View>
                                 
                                </View>}
                              
                            </View>

                        )
                    }}
                />
                     <CustomAlertModal 
                            title='Submitted Succesfully.'
                            modalVisible={alertModal}
                            setModalVisible={()=>setAlertModal(false)}
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