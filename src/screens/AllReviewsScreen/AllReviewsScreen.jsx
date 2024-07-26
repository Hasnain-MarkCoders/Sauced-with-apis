import React from 'react';
import { View, SafeAreaView, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import home from './../../../assets/images/home.png';
import Header from '../../components/Header/Header';
import { scale } from 'react-native-size-matters';
import SingleReview from '../../components/SingleReview/SingleReview.jsx';
import { useNavigation } from '@react-navigation/native';

const AllReviewsScreen = () => {
  const navigation = useNavigation()
    return (
        <ImageBackground style={{ flex: 1, width: '100%', height: '100%' }} source={home}>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView

                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={{ flex: 1 }}>
                    <Header showMenu={false} showText={false} cb={() => navigation.goBack()} showProfilePic={false} showDescription={false}  />
                    <View style={{ paddingHorizontal: 20, flex: 1, justifyContent: "space-between", paddingVertical: 40, paddingBottom: 100, gap: scale(10) }}>
                      <View style={{
                        gap:20
                      }}>
                        <View style={{
                                flexDirection:"row",
                                alignItems:"baseline",
                                justifyContent:"space-between"
 
 }}>
                            <Text style={{
                                 color: "white",
                                 fontWeight: 600,
                                 fontSize: scale(35),
                                 lineHeight: scale(50)
                            }}>
                                Reviews
                            </Text>
                            <TouchableOpacity 
                            onPress={()=>{navigation.navigate("AddReview")}}
                            
                            style={{
                                backgroundColor:"#2e210a",
                                padding:scale(10),
                                alignSelf:"flex-start",
                                borderRadius:scale(10),
                                borderWidth:1,
                                borderColor:"#FFA100"

                            }}><Text style={{
                                fontSize:scale(13),
                                color:"white"
                            }}>
                                Add Review +
                            </Text></TouchableOpacity>
                        </View>
                        {
                          Array.from({length:10}, (_, index)=>(<SingleReview key={index}/>))
                        }
                      </View>
                  </View>
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
};

export default AllReviewsScreen;


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
        fontSize:scale(14)
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