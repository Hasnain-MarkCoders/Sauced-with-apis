import { Image, ImageBackground, Text, TouchableOpacity, Vibration, View,   Platform,KeyboardAvoidingView, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import home from "./../../../assets/images/home.png"
import { featuredSauces, handleText, topRatedSauces } from '../../../utils'
import { scale } from 'react-native-size-matters'
import qr from "./../../../assets/images/qr.png"
import CustomInput from '../../components/CustomInput/CustomInput'
import { useNavigation, useRoute } from '@react-navigation/native'
import search from "./../../../assets/images/search_icon.png";
import ProductSearchList from '../../components/ProductSearchList/ProductSearchList'
import { UNSPLASH_URL, VITE_UNSPLASH_ACCESSKEY } from "@env"
import axios from 'axios'
import Header from '../../components/Header/Header'
import CustomAlertModal from '../../components/CustomAlertModal/CustomAlertModal'
import CustomProductReviewModal from '../../components/CustomProductReviewModal/CustomProductReviewModal'
import useAxios from '../../../Axios/useAxios'
import SingleReview from '../../components/SingleReview/SingleReview'
import { useSelector } from 'react-redux'


const AllUserReviews = () => {
    const route = useRoute()
    const userComeFrom = route?.params?.route
    const axiosInstance = useAxios()
    
    const _id = route?.params?._id
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation()
    const auth  = useSelector(state=>state.auth)
    useEffect(() => {
        const fetchPhotos = async () => {
            if (!hasMore || loading) return;
    
            setLoading(true);
            try {
                const res = await axiosInstance.get(`/get-user-reviews`, {
                    params: {
                        page: page,
                        _id
                    }
                });
                    setHasMore(res?.data?.pagination?.hasNextPage);
                    setData(prev=>[...prev, ...res?.data?.reviews]);
            } catch (error) {
                console.error('Failed to fetch photos:', error);
            } finally {
                setLoading(false);
            }
        };
       
        fetchPhotos();
    }, [page]);

    return (
        

   <ImageBackground

            source={home}
            style={{
                flex: 1,
            }}>
                <View style={{
                    paddingHorizontal:scale(20),
                    paddingTop:scale(30)
                }}>

                <Header showText={false} showMenu={false} showProfilePic={false} cb={()=>{navigation.goBack();  Vibration.vibrate(10)}} headerContainerStyle={{paddingTop:scale(0), paddingHorizontal:0}} title="Reviewed Sauces" showDescription={false} description="" /> 
                </View>
                <View style={{ paddingHorizontal: scale(20), flex: 1, justifyContent: "space-between",paddingBottom:scale(6), gap: scale(10) }}>
                <Text style={{
                                    color: "white",
                                    fontWeight: 600,
                                    fontSize: scale(35),
                                    lineHeight: scale(50),
                                }}>
                                    Reviews
                                </Text>


                                    <FlatList
                                                contentContainerStyle={{
                                                    gap:scale(10)
                                                }}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                    data={data}
                                    onEndReachedThreshold={1}
                                    onEndReached={() => {
                                        if (!loading && hasMore) {
                                            setPage(currentPage => currentPage + 1);
                                        }
                                    }}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) => 
                                    <SingleReview item={item} />
                                        
                                        }
                                />
                </View>
        </ImageBackground>


    )
}

export default AllUserReviews