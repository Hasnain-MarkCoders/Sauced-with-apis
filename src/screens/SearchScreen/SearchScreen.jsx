import { Image, ImageBackground, Text, TouchableOpacity, Vibration, View,   Platform,KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useState } from 'react'
import home from "./../../../assets/images/home.png"
import { featuredSauces, handleText, topRatedSauces } from '../../../utils'
import { scale } from 'react-native-size-matters'
import qr from "./../../../assets/images/qr.png"
import CustomInput from '../../components/CustomInput/CustomInput'
import { useNavigation } from '@react-navigation/native'
import search from "./../../../assets/images/search_icon.png";
import ProductSearchList from '../../components/ProductSearchList/ProductSearchList'
import { UNSPLASH_URL, VITE_UNSPLASH_ACCESSKEY } from "@env"
import axios from 'axios'

const SearchScreen = () => {

    const [data, setData] = useState([]);
    const [searchListData, setSeachListData] = useState([...featuredSauces,...topRatedSauces, ...featuredSauces,
        ...topRatedSauces])
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState({
        search: "",
    });
    const [showQRCode, setShowQRCode] = useState(false)
    const navigation = useNavigation()

    useEffect(() => {
        const fetchPhotos = async () => {
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

    useEffect(() => {
        const fetchPhotos = async () => {
            if (!query?.search?.trim()) {
                return
            }
            console.log("query.search", query.search)
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

                setData(prev=>[...res?.data?.results,...prev]);

            } catch (error) {
                console.error('Failed to fetch photos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPhotos();
    }, [query.search, page]);
    return (

   <ImageBackground

            source={home}
            style={{
                flex: 1,
                paddingHorizontal:scale(20),
                paddingTop:scale(30),
            }}>
                <KeyboardAvoidingView
                style={{
                    flex:1
                }}
                      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                      >
            <View style={{
                marginBottom: scale(10),
            }}>
                <View style={{
                    flexDirection: "row",
                    alignItems: 'end',
                    marginBottom: scale(10),
                    gap: 10
                }}>
                    <CustomInput
                    imageStyles={{top:"50%", transform: [{ translateY: -0.5 * scale(25) }], width:scale(25), height:scale(25), aspectRatio:"1/1"}}
                      isURL={false}
                      showImage={true}
                      uri={search}
                        name="search"
                        onChange={handleText}
                        updaterFn={setQuery}
                        value={query.search}
                        showTitle={false}
                        placeholder="Hot Sauce..."
                        containterStyle={{
                            flexGrow: 1,
                        }}
                        inputStyle={{
                            borderColor: "#FFA100",
                            borderWidth: 1,
                            borderRadius: 10,
                            padding: 15,
                            paddingLeft:scale(45)

                        }} />

                    <TouchableOpacity onPress={() => {navigation.navigate("QRScreen") }}>
                        <View>

                            <Image source={qr} style={{
                                 borderRadius: scale(10),
                                 width: scale(50),
                                 height: scale(50)
                            }} />
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={()=>{
                                    Vibration.vibrate(10)
                                    navigation.navigate("SauceDetails")
                                }}>

                <Text style={[{ color: "white",
        fontSize: scale(10),
        lineHeight: scale(13),
        fontFamily: "Montserrat"}, { textDecorationLine: "underline", fontWeight:700,
        }]}>
                    Don't see what you're looking for? Request a sauce or brand.
                </Text>
                </TouchableOpacity>

            </View>
            <View style={{
                flex:1,
            }}>
                <ProductSearchList  loading={loading} hasMore={hasMore} setPage={setPage} data={searchListData}/>

            </View>
</KeyboardAvoidingView>
        </ImageBackground>


    )
}

export default SearchScreen