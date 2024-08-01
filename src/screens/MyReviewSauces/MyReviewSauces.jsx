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
import Header from '../../components/Header/Header'

const MyReviewSauces = () => {

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

        // fetchPhotos();
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

        // fetchPhotos();
    }, [query.search, page]);
    return (

   <ImageBackground

            source={home}
            style={{
                flex: 1,
                paddingHorizontal:scale(20),
                paddingTop:scale(30),
            }}>
               
         
                
            <View style={{
                flex:1,
            }}>
                <Header showText={false} showMenu={false} showProfilePic={false} cb={()=>{navigation.goBack();  Vibration.vibrate(10)}} headerContainerStyle={{paddingTop:scale(0), paddingHorizontal:0}} title="Reviewed Sauces" showDescription={false} description="" /> 
                <ProductSearchList  loading={loading} hasMore={hasMore} setPage={setPage} data={searchListData}/>

            </View>

        </ImageBackground>


    )
}

export default MyReviewSauces