import { ImageBackground, SafeAreaView, StyleSheet, Text, Vibration, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header/Header'
import home from './../../../assets/images/home.png';
import { s, scale, verticalScale } from 'react-native-size-matters';
import { UNSPLASH_URL, VITE_UNSPLASH_ACCESSKEY } from "@env"
import axios from 'axios';
import AwardList from '../../components/AwardList/AwardList.jsx';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import CustomAlertModal from '../../components/CustomAlertModal/CustomAlertModal.jsx';
import { awardListImages } from '../../../utils.js';

const Awards = () => {
    const [data, setData] = useState([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation()
    const [alertModal, setAlertModal]=useState(false)
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
    return (
        <ImageBackground style={{ flex: 1, width: '100%', height: '100%' }} source={home}>
            <SafeAreaView
            
            style={{ flex: 1, paddingBottom: verticalScale(80) }}>
                <Header
                showMenu={false}
                showProfilePic={true}
                
                cb={() => navigation.goBack()}
                
                
                headerContainerStyle={{
                    paddingBottom: verticalScale(30)
                }} showText={false} />

                <FlatList
                 showsVerticalScrollIndicator={false}
                 showsHorizontalScrollIndicator={false}
                    data={[1, 1]}
                    renderItem={({ item, index }) => {
                        return (<View style={{
                            paddingHorizontal: scale(20),
                            flex:1

                        }}>
                            {

                                index == 0 && <View>
                                    <View style={{
                                        width:"100%",
                                        backgroundColor:"#FFA100",
                                        borderRadius:scale(12),
                                        justifyContent:"center",
                                        paddingLeft:scale(20),
                                        paddingVertical:scale(20),
                                        gap:scale(3)
                                    }}>
                                        <Text style={{
                                            color:"white",
                                            fontSize:scale(16),
                                            lineHeight:scale(20),
                                            fontWeight:500
                                        }}>
                                        My Points
                                        </Text>
                                        <View style={{
                                            gap:scale(15)
                                        }}>

                                        <Text style={{
                                             color:"white",
                                             fontSize:scale(40),
                                             lineHeight:scale(50),
                                             fontWeight:500
                                        }}>
                                        10 Points
                                        </Text>
                                        
                                    <View style={{
                                        flexDirection:"row",
                                        gap:scale(10),
                                        padding:scale(10),
                                        borderRadius:scale(50),
                                        backgroundColor:"white",
                                        alignSelf:"flex-start",
                                    }}>

                                        <View style={{
                                            backgroundColor:"#FFA100",
                                            borderRadius:scale(50),
                                            width:scale(10),
                                            height:scale(10)
                                        }}>

                                        </View>

                                        <Text style={{
                                            color:"#FFA100",
                                            lineHeight:scale(12),
                                            fontSize:scale(10),
                                            fontWeight:700
                                        }}>
                                        Badges
                                        </Text>

                                        <Text style={{
                                            color:"#FFA100",
                                            lineHeight:scale(12),
                                            fontSize:scale(10),
                                            fontWeight:700
                                        }}>
                                        1/6
                                        </Text>

                                    </View>
                                        </View>


                                    </View>
                                    <TouchableOpacity onPress={()=>
                                        {
                                            Vibration.vibrate(10)
                                            setAlertModal(true)
                                        }
                                    }>

                                        <Text style={{
                                            fontSize:scale(10),
                                            lineHeight:scale(12),
                                            color:"white",
                                            marginTop:scale(5),
                                            marginBottom:scale(20)
                                        }}>
                                        Redeem points (Coming soon)
                                        </Text>
                                    </TouchableOpacity>

                                    <Text style={{
                                        color: "white",
                                        fontWeight: 600,
                                        fontSize: 35,
                                        lineHeight: 50
                                    }}>Badges</Text>

                                    
                                    </View>
                            }
                            {
                                index == 1 && <AwardList loading={loading} hasMore={hasMore} setPage={setPage}
                                data={awardListImages}
                                // data={data}
                                 />

                            }
                        </View>)

                    }}

                />
     <CustomAlertModal
                            title='Feature Coming Soon.'
                            modalVisible={alertModal}
                            setModalVisible={()=>setAlertModal(false)}
                            />
            </SafeAreaView>
        </ImageBackground>
    )
}

export default Awards

const styles = StyleSheet.create({
    separator: {
        marginRight: scale(20),
    }

})