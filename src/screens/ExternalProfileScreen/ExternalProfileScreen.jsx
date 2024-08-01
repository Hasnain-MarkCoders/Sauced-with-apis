import { ImageBackground, SafeAreaView, StyleSheet, Text, View, Keyboard, TouchableOpacity, Vibration, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header/Header.jsx'
import home from './../../../assets/images/home.png';
import { scale, verticalScale } from 'react-native-size-matters';
import { UNSPLASH_URL, VITE_UNSPLASH_ACCESSKEY } from "@env"
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';
import SauceList from '../../components/SauceList/SauceList.jsx';
import { handleText, topRatedSauces } from '../../../utils.js';
import CustomInput from '../../components/CustomInput/CustomInput.jsx';
import ExternalUserCard from '../../components/ExternalUserCard/ExternalUserCard.jsx';
import CustomButtom from '../../components/CustomButtom/CustomButtom.jsx';
import arrow from "./../../../assets/images/arrow.png";

const ExternalProfileScreen = ({
}) => {
    const route = useRoute()
    const name = route?.params?.name
    const url = route?.params?.url
    const [data, setData] = useState([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false);
    const [isKeyBoard, setIsKeyBoard] = useState(false)
    const [query, setQuery] = useState({
        search: "",
    });
    const navigation = useNavigation()
    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            setIsKeyBoard(true)
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setIsKeyBoard(false)
        });

        // Cleanup function
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);
    useEffect(() => {
        const fetchPhotos = async () => {
            if (!query?.search?.trim()) {
                return
            }
            if (loading) return;
            setLoading(true);
            try {
                const res = await axios.get(`${UNSPLASH_URL}/search/photos`, {
                    params: {
                        client_id: VITE_UNSPLASH_ACCESSKEY,
                        page: page,
                        query: query?.search
                    }
                });

                setData(prev => [...res.data.results, ...prev]);

            } catch (error) {
                console.error('Failed to fetch photos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPhotos();
    }, [query.search, page]);

    useEffect(() => {
        const fetchPhotos = async () => {
            if (query?.search.trim()) {
                return
            }
            if (!hasMore || loading) return;
            setLoading(true);
            try {
                const res = await axios.get(`${UNSPLASH_URL}/photos`, {
                    params: {
                        client_id: VITE_UNSPLASH_ACCESSKEY,
                        page: page
                    }
                });
                if (res.data.length === 0) {
                    setHasMore(false);
                } else {
                    setData(prevData => [...prevData, ...res.data]);
                }
            } catch (error) {
                console.error('Failed to fetch photos:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPhotos();
    }, [page]);
    return (
        <ImageBackground style={{ flex: 1, width: '100%', height: '100%' }} source={home}>
            <SafeAreaView style={{ flex: 1, paddingBottom: isKeyBoard ? 0 : verticalScale(0) }}>

                <Header
                    cb={() => navigation.goBack()} showMenu={false} showProfilePic={false} headerContainerStyle={{
                        paddingBottom: scale(20)
                    }} showText={false} />

                <FlatList
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    data={[1, 1, 1]}
                    renderItem={({ item, index }) => {
                        return (
                            <View style={{
                                width: "100%",
                                flex: 1,
                                paddingHorizontal: scale(20)

                            }}>

                                {
                                    index == 0 && <View style={{
                                        marginBottom: scale(20)
                                    }}>

                                        <View style={{
                                            flexDirection: "row",
                                            gap: scale(10)
                                        }}>

                                            <Text
                                                numberOfLines={1} ellipsizeMode="tail"

                                                style={{
                                                    color: "white",
                                                    fontWeight: 600,
                                                    fontSize: scale(35),
                                                    lineHeight: scale(50),
                                                    marginBottom: scale(20),
                                                    maxWidth: scale(130)

                                                }}>
                                                {name}

                                            </Text>

                                            <Text style={{
                                                color: "white",
                                                fontWeight: 600,
                                                fontSize: scale(35),
                                                lineHeight: scale(50),
                                                marginBottom: scale(20)

                                            }}>
                                                Profile

                                            </Text>
                                        </View>
                                        <ExternalUserCard name={name} url={url} />


                                    </View>
                                }
                                {
                                    index == 1 && <View>
                                        <View style={{
                                            marginBottom: scale(10)
                                        }}>

                                            {/* <CustomInput

                                                imageStyles={{ top: "50%", transform: [{ translateY: -0.5 * scale(25) }], width: scale(25), resizeMode: 'contain', height: scale(25), aspectRatio: "1/1" }}
                                                isURL={false}
                                                showImage={true}
                                                uri={search}

                                                cb={() => setPage(1)}
                                                name="search"
                                                onChange={handleText}
                                                updaterFn={setQuery}
                                                value={query.search}
                                                showTitle={false}
                                                placeholder="Search Favourite..."
                                                containterStyle={{
                                                    flexGrow: 1,
                                                }}
                                                inputStyle={{
                                                    borderColor: "#FFA100",
                                                    borderWidth: 1,
                                                    borderRadius: 10,
                                                    padding: 15,
                                                    paddingLeft: scale(45)

                                                }} /> */}
                                        </View>
                                        <TouchableOpacity onPress={() => {
                                            Vibration.vibrate(10)
                                            navigation.navigate("AllReviews")

                                        }}>

                                            <Text style={{
                                                textDecorationLine: "underline", color: "white",
                                                fontSize: scale(10),
                                                fontWeight: 700,
                                                lineHeight: scale(13),
                                                fontFamily: "Montserrat"
                                            }}>
                                                All hot sauce reviews
                                            </Text>
                                        </TouchableOpacity>

                                    </View>
                                }
                                {
                                    index == 2 && <View style={{
                                        marginTop: scale(30),
                                        gap:scale(30)
                                    }}>

                                        <SauceList data={topRatedSauces} name={name} title='Favorites' searchTerm={query.search} />
                                        <SauceList data={topRatedSauces} title='Checked in Sauces' searchTerm={query.search} />
                                        <SauceList title='Reviewed Sauces' data={topRatedSauces} />



                                        <View style={{
                                            marginTop: scale(60),
                                            marginBottom: scale(20),
                                            gap: scale(20)
                                        }}>
                                            <CustomButtom
                                                Icon={() => <Image source={arrow} />}
                                                showIcon={true}
                                                buttonTextStyle={{ fontSize: scale(14), fontWeight: 700 }}
                                                buttonstyle={{ width: "100%", borderColor: "#FFA100", backgroundColor: "#2e210a", padding: 15, display: "flex", gap: 10, flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" }}
                                                // onPress={() => {
                                                //     Vibration.vibrate(10);
                                                //     Alert.alert("Blocked")

                                                // }}
                                                title={`Block`}

                                            />


                                            <CustomButtom
                                                Icon={() => <Image source={arrow} />}
                                                showIcon={true}
                                                buttonTextStyle={{ fontSize: scale(14), fontWeight: 700 }}
                                                buttonstyle={{ width: "100%", borderColor: "#FFA100", backgroundColor: "#2e210a", padding: 15, display: "flex", gap: 10, flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" }}
                                                // onPress={() => {
                                                //     Vibration.vibrate(10);
                                                //     Alert.alert("reported")

                                                // }}
                                                title={`Report`}

                                            />


                                            <CustomButtom
                                                Icon={() => <Image source={arrow} />}
                                                showIcon={true}
                                                buttonTextStyle={{ fontSize: scale(14), fontWeight: 700 }}
                                                buttonstyle={{ width: "100%", borderColor: "#FFA100", backgroundColor: "#2e210a", padding: 15, display: "flex", gap: 10, flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" }}
                                                // onPress={() => {
                                                //     Vibration.vibrate(10);
                                                //     // navigation.navigate("SauceDetails")
                                                //     Alert.alert("shared")
                                                // }}
                                                title={`Share`}

                                            />
                                        </View>
                                    </View>

                                }
                            </View>
                        )
                    }}
                />
            </SafeAreaView>
        </ImageBackground>
    )
}

export default ExternalProfileScreen

const styles = StyleSheet.create({
    separator: {
        marginRight: scale(20),
    }

})