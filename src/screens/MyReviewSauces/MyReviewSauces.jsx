import { Image, ImageBackground, Text, TouchableOpacity, Vibration, View,   Platform,KeyboardAvoidingView } from 'react-native'
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


const MyReviewSauces = () => {
    const route = useRoute()
    const userComeFrom = route?.params?.route
  const axiosInstance = useAxios()

    const [data, setData] = useState([]);
    // const [searchListData, setSeachListData] = useState([...featuredSauces,...topRatedSauces, ...featuredSauces,
    //     ...topRatedSauces])
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [alertModal, setAlertModal] =useState(false)
    const [productDetails, setProductDetails] = useState({})
    const navigation = useNavigation()
    useEffect(() => {
        const fetchPhotos = async () => {
            if (!hasMore || loading) return;
    
            setLoading(true);
            try {
                const res = await axiosInstance.get(`/get-sauces`, {
                    params: {
                        type:"checkedin",
                        page: page
                    }
                });
    
                if (res?.data?.sauces?.length === 0) {
                    setHasMore(false);
                } else {
                    setData(prev=>[...prev, ...res?.data?.sauces]);
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
                <ProductSearchList 
                type="checkedin"
                style={{
                    paddingVertical:scale(10),
                    paddingHorizontal:scale(20),
                }}
                setProductDetails={setProductDetails}
                setAlertModal={setAlertModal}
                loading={loading} hasMore={hasMore} setPage={setPage} data={data}/>
                 <CustomProductReviewModal
                            userComeFrom = {userComeFrom}
                            data={productDetails}
                            modalVisible={alertModal}
                            setModalVisible={()=>setAlertModal(false)}
                            />
        </ImageBackground>


    )
}

export default MyReviewSauces