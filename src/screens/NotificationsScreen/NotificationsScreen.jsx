import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import home from './../../../assets/images/home.png';
import Header from '../../components/Header/Header';
import { scale } from 'react-native-size-matters';
import { FlatList } from 'react-native-gesture-handler';
import CustomNotification from '../../components/CustomNotification/CustomNotification.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { clearCount, clearNotifications, deleteNotification } from '../../../android/app/Redux/notifications.js';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';
const NotificationsScreen = ({
}) => {
    const navigation = useNavigation()
    const route = useRoute()
    const dispatch = useDispatch()
    let notificationsData = useSelector(state=>state.notifications)
    let notifications = notificationsData?.notifications
    let count = notificationsData.count
    useEffect(()=>{
            if(route?.name=="Notifications"){
            dispatch(clearCount())
            }
    },[count, notificationsData?.length])
   
    const renderRightActions = (index) => (
        <TouchableOpacity
          style={{
            backgroundColor: "#2e210a",
            padding: scale(10),
            borderRadius: scale(10),
            borderWidth: 1,
            borderColor: "#FFA100",
            width: 75,
            alignItems:"center",
            justifyContent:"center",
            marginLeft:scale(50)
          }}
          onPress={() => dispatch(deleteNotification(index))}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Delete</Text>
        </TouchableOpacity>
      );
    return (
        <ImageBackground style={{ flex: 1, width: '100%', height: '100%' }} source={home}>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={{ flex: 1 }}>
                    <Header showMenu={false} showText={false} cb={() => navigation.goBack()} showProfilePic={false} showDescription={false} />
                    <View style={{ paddingHorizontal: scale(20), flex: 1, justifyContent: "space-between", paddingVertical: scale(40), paddingBottom: 100, gap: scale(10) }}>
                        <View style={{
                            gap: scale(20),
                        }}>
                            <View style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}>
                                <Text style={{
                                    color: "white",
                                    fontWeight: 600,
                                    fontSize: scale(35),
                                    lineHeight: scale(50),
                                }}>
                                    Notifications
                                </Text>

                               {notifications?.length>0 && <TouchableOpacity
                                    onPress={() => { 
                                        dispatch(clearNotifications())
                                        console.log("notifications", notifications)
                                     }}

                                    style={{
                                        backgroundColor: "#2e210a",
                                        padding: scale(10),
                                        // alignSelf: "flex-start",
                                        borderRadius: scale(10),
                                        borderWidth: 1,
                                        borderColor: "#FFA100"

                                    }}><Text style={{
                                        fontSize: scale(13),
                                        color: "white"
                                    }}>
                                        Clear All 
                                    </Text></TouchableOpacity>}

                            </View>


                            <FlatList
                                contentContainerStyle={{
                                    gap: scale(10)
                                }}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                data={notifications}
                                extranotifications={notifications}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) =>

                                    <Swipeable
                                    renderRightActions={() => renderRightActions(index)}
                                  >
                                    <CustomNotification
                                      title={item.title}
                                      body={item.body}
                                    />
                                  </Swipeable>
                                    // <CustomNotification title={item.title} body={item.body} />

                                }

                            />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
};

export default NotificationsScreen;


const styles = StyleSheet.create({
    dropdownButtonStyle: {
        width: "100%",
        height: 50,
        backgroundColor: "#2e210a",
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderColor: "#FFA100",
        borderWidth: 1
    },
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: 'white',
        fontSize: scale(14)
    },
    dropdownButtonArrowStyle: {
        fontSize: 28,
    },
    dropdownButtonIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
    dropdownMenuStyle: {
        backgroundColor: "#2e210a",
        borderColor: "#FFA100",
        borderWidth: 1,
        borderRadius: 8,
    },
    dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        borderRadius: 8,
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: scale(14),
        fontWeight: '500',
        color: 'white',
    },
    dropdownItemIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
});