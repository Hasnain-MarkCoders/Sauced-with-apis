import React, { useEffect, useState } from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View, Vibration, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import home from './../../../assets/images/home.png';
import search from "./../../../assets/images/search_icon.png";
import qr from "./../../../assets/images/qr.png";
import { Brands, handleText } from '../../../utils';
import SauceList from '../../components/SauceList/SauceList';
import BrandList from '../../components/BrandList/BrandList';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomButtom from '../../components/CustomButtom/CustomButtom';
import arrow from "./../../../assets/images/arrow.png";
import { useNavigation } from '@react-navigation/native';
import CustomAlertModal from '../../components/CustomAlertModal/CustomAlertModal';
import CustomCarousel from '../../components/CustomCarousel/CustomCarousel';
import CustomOfficialReviewsListCarousel from '../../components/CustomOfficialReviewsListCarousel/CustomOfficialReviewsListCarousel';
import TopRatedSaucesList from '../../components/TopRatedSaucesList/TopRatedSaucesList';
import FeaturedSaucesList from '../../components/FeaturedSaucesList/FeaturedSaucesList';

const Home = () => {
    const navigation = useNavigation()
    const [alertModal, setAlertModal] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)
    const [data, setData] = useState({
        search: "",
    });

    useEffect(() => {
        setTimeout(() => {
            setInitialLoading(false)
        }, 1000)
    })

    if (initialLoading) {
        return (
            <ImageBackground source={home} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#FFA100" />
            </ImageBackground>
        );
    }
    return (

        <ImageBackground source={home} style={styles.background}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                style={styles.scrollView}>
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.searchContainer}>
                        <View style={styles.searchBarContainer}>
                            <TouchableOpacity
                            
                            style={{width:"100%"}}
                            onPress={()=>{
                                navigation.navigate("Search")
                            }}>

                            <CustomInput
                            readOnly={true}
                                imageStyles={{ top: "50%", transform: [{ translateY: -0.5 * scale(25) }], resizeMode: 'contain', width: scale(25), height: scale(25), aspectRatio: "1/1" }}
                                isURL={false}
                                showImage={true}
                                uri={search}
                                name="search"
                                onChange={handleText}
                                updaterFn={setData}
                                value={data.search}
                                showTitle={false}
                                placeholder="Search For Sauce..."
                                containterStyle={{
                                    flexGrow: 1,
                                }}
                                inputStyle={{
                                    borderColor: "#FFA100",
                                    borderWidth: 1,
                                    borderRadius: 10,
                                    padding: 15,
                                    paddingLeft: scale(45)

                                }} />
                            </TouchableOpacity>

                            {/* <TouchableOpacity onPress={() => { navigation.navigate("QRScreen") }}>
                                <View>

                                    <Image source={qr} style={styles.qrImage} />
                                </View>
                            </TouchableOpacity> */}
                        </View>
                        <TouchableOpacity onPress={() => {
                            Vibration.vibrate(10)
                            navigation.navigate("RequestASauceScreen")
                        }}>

                            <Text style={[styles.infoText, {
                                textDecorationLine: "underline", fontWeight: 700,
                            }]}>
                                Don't see what you're looking for? Request a sauce or brand.
                            </Text>
                        </TouchableOpacity>

                    </View>

                    
                    <View style={{
                        position: "relative",
                        gap:scale(10)
                    }}>
                        <Text style={
                        {
                            color: "white",
                            lineHeight: scale(29),
                            fontSize: scale(24),
                            fontWeight: "600",
                        }
                    }>
                        Events
                    </Text>

                        <CustomCarousel
                            showText={true}
                        />
                    </View>
                    <View style={styles.contentContainer}>
                    <FeaturedSaucesList
                            title='Featured Sauces'
                    />
                    <TopRatedSaucesList
                            title='Top Rated Sauces'
                    />
                        <CustomButtom
                            Icon={() => <Image source={arrow} />}
                            showIcon={true}
                            buttonTextStyle={{ fontSize: scale(14) }}
                            buttonstyle={{
                                width: "100%", borderColor: "#FFA100",
                                backgroundColor: "#2e210a", padding: 15,
                                display: "flex", gap: 10, flexDirection: "row-reverse",
                                alignItems: "center", justifyContent: "space-between"
                            }}
                            onPress={() => navigation.navigate("Map")}
                            title={"Hot Sauce Map"}
                        />
                        <BrandList title='Top Rated Brands' data={Brands} />
                        <View style={{
                            gap: scale(20)
                        }}>
                            <Text style={
                                {
                                    color: "white",
                                    lineHeight: verticalScale(28.8),
                                    fontSize: moderateScale(24),
                                    fontWeight: "600",
                                }
                            }>
                                Official Reviews
                            </Text>
                            <CustomOfficialReviewsListCarousel
                                showText={false}
                            />
                        </View>

                        <CustomButtom
                            Icon={() => <Image source={arrow} />}
                            showIcon={true}
                            buttonTextStyle={{ fontSize: scale(14) }}
                            buttonstyle={{ width: "100%", borderColor: "#FFA100", backgroundColor: "#2e210a", padding: 15, display: "flex", gap: 10, flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" }}
                            onPress={() => {
                                Vibration.vibrate(10);
                                // navigation.navigate("SauceDetails")
                                navigation.navigate("RequestASauceScreen")
                            }}
                            title={"Want to List Sauce? "}
                        />

                    </View>
                    <CustomAlertModal
                        title='Feature Coming Soon.'
                        modalVisible={alertModal}
                        setModalVisible={() => setAlertModal(false)}
                    />
                </SafeAreaView>
            </ScrollView>
        </ImageBackground>

    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    scrollView: {
        flex: 1,
    },
    safeArea: {
        paddingTop: verticalScale(30),
        paddingBottom: verticalScale(150),
        paddingHorizontal: scale(20),
        flex: 1,
    },
    closeButton: {
        alignSelf: 'center',
        marginTop: 20,
    },
    fullScreen: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        flex: 1
    },
    searchContainer: {
        marginBottom: verticalScale(20),

    },
    searchBarContainer: {
        flexDirection: "row",
        alignItems: 'end',
        marginBottom: verticalScale(10),
        gap: 10
    },
    searchBar: {
        height: verticalScale(50),
        borderRadius: moderateScale(10),
        borderWidth: 1,
        borderColor: "#FFA100",
        flexGrow: 1,
        marginRight: scale(10),
    },
    qrImage: {
        borderRadius: moderateScale(10),
        width: scale(50),
        height: scale(50),
    },
    infoText: {
        color: "white",
        fontSize: moderateScale(10),
        lineHeight: verticalScale(13),
        fontFamily: "Montserrat",
    },
    contentContainer: {
        gap: verticalScale(40),
        marginTop: scale(30)
    },
    mainBanner: {
        position: "relative",
        gap: verticalScale(10),
        marginBottom: verticalScale(50)

    },
    bannerContainer: {
        position: "relative",
        width: "100%",
        height: verticalScale(130),
        gap: verticalScale(10),
    },
    bannerImage: {
        width: "100%",
        height: "100%",
        borderRadius: moderateScale(10),
    },
    bannerTextContainer: {
        position: "absolute",
        top: "50%",
        left: "10%",
        transform: [{ translateY: -25 }, { translateX: -10 }],
    },
    bannerText: {
        color: "white",
        fontSize: moderateScale(23),
        fontWeight: 'bold',
    }
});

export default Home;
