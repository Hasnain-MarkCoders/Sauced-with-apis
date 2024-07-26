import { ImageBackground, SafeAreaView, Text, View, Keyboard, ActivityIndicator } from 'react-native'
import React, { memo, useEffect, useState, useRef } from 'react'
import Header from '../../components/Header/Header.jsx'
import getStartedbackground from './../../../assets/images/ProductDescription.jpg';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { UNSPLASH_URL, VITE_UNSPLASH_ACCESSKEY } from "@env"
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';
import SauceList from '../../components/SauceList/SauceList.jsx';
import { topRatedSauces } from '../../../utils.js';
import ProductsBulletsList from '../../components/ProductsBulletsList/ProductsBulletsList.jsx';
import ProductCard from '../../components/ProductCard/ProductCard.jsx';
import { useRoute } from "@react-navigation/native"
import CustomSelectListModal from '../../components/CustomSelectListModal/CustomSelectListModal.jsx';
import Snackbar from 'react-native-snackbar';
import CommentsList from '../../components/CommentsList/CommentsList.jsx';
const Product = () => {
  const route = useRoute()
  const { url = "", title = "" } = route?.params
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true)
  const [isKeyBoard, setIsKeyBoard] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [isEnabled, setisEnabled] = useState(true)
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
        setInitialLoading(false)
      }
    };
    fetchPhotos();
  }, [page]);
  const handleLoading = (listNumber, action) => {
    if (listNumber == 1) {
      return setLoading1(action)
    }
    if (listNumber == 2) {
      return setLoading2(action)
    }
    if (listNumber == 3) {
      return setLoading3(action)
    }

  }
  addToList = (listNumber) => {
    handleLoading(listNumber, true)
    Snackbar.show({
      text: `sauce adding in List ${listNumber}`,
      duration: Snackbar.LENGTH_SHORT,
      action: {
        text: 'UNDO',
        textColor: 'green',
        onPress: () => {
          Snackbar.show({
            text: `sauce remove from List ${listNumber}`,
            duration: Snackbar.LENGTH_SHORT,
          });
        },
      },
    });
    setTimeout(() => {
      handleLoading(listNumber, false)
      setModalVisible(false)
      setisEnabled(true)
    }, 2000)


  }



  if (initialLoading) {
    return (
      <ImageBackground source={getStartedbackground} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FFA100" />
      </ImageBackground>
    );
  }
  return (
    <ImageBackground style={{ flex: 1, width: '100%', height: '100%' }} source={getStartedbackground}>
      <SafeAreaView style={{ flex: 1, paddingBottom: isKeyBoard ? 0 : verticalScale(0) }}>
        <Header

          showMenu={false}
          cb={() => navigation.goBack()} showProfilePic={false} headerContainerStyle={{
            paddingBottom: scale(20)
          }} title={"Followers"} showText={false} />

        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={[1, 1, 1, 1]}
          renderItem={({ item, index }) => {
            return (
              <View


                style={{
                  width: "100%",
                  flex: 1,
                  paddingHorizontal: scale(20),

                }}>

                {
                  index == 0 && <View style={{
                    marginBottom: scale(20)
                  }}>
                    <ProductCard
                      setshowListModal={setModalVisible}
                      url={url} title={title} />
                  </View>
                }

                {
                  index == 1 && <View style={{
                    marginBottom: scale(20),
                    gap: scale(20)
                  }}>


                    <Text style={{
                      color: "white",
                      lineHeight: verticalScale(29),
                      fontSize: moderateScale(24),
                      fontWeight: 600,
                    }}>
                      About Hot Sauce

                    </Text>

                    <ProductsBulletsList

                      textStyles={{
                        fontWeight: 700,
                        color: "white"
                      }}
                    />


                    <Text style={{
                      color: "white",
                      lineHeight: verticalScale(29),
                      fontSize: moderateScale(24),
                      fontWeight: "600",
                      marginTop: scale(20)
                    }}>
                      Chili peppers used

                    </Text>

                    <ProductsBulletsList
                    bulletStyle={{
                      backgroundColor:"#FFA100"
                    }}
                    textStyles={{
                      fontWeight: 700
                    }} />



                    <Text style={{
                      color: "white",
                      lineHeight: verticalScale(29),
                      fontSize: moderateScale(24),
                      fontWeight: 600,
                      marginTop: scale(20)

                    }}>
                      Ingredients

                    </Text>

                    <Text style={{
                      color: "white",
                      fontFamily: "Montserrat",
                      fontSize: scale(12),
                      fontWeight: 700,
                      lineHeight: 18,

                    }}>
                      1 lb. Fresh Chiles, Such As Jalapeno, Serrano, Fresno, Poblano, Habanero, Or A Mix.

                    </Text>


                  </View>
                }
                {
                  index == 2 && <View style={{
                    marginTop: scale(20),
                    marginBottom: scale(20)
                  }}>
                    <View style={{
                      gap: scale(30)
                    }}>

                      <SauceList title='Shared Images' data={topRatedSauces} />
                      <View>
                        <Text style={{
                          color: "white",
                          lineHeight: scale(29),
                          fontSize: scale(24),
                          fontWeight: "600",
                          marginTop: scale(20)
                        }}>
                          Check-ins
                        </Text>
                      </View>

                      <CommentsList setPage={setPage} data={data} loading={loading} hasMore={hasMore} />


                    </View>


                  </View>


                }
              </View>
            )
          }}
        />
        <CustomSelectListModal
          modalVisible={modalVisible}
          setModalVisible={() => { setModalVisible(false) }}
          cb={addToList}
          isEnabled={isEnabled}
          loading1={loading1}
          loading2={loading2}
          loading3={loading3}
          title1="List 1"
          title2="List 2"
          title3="List 3"

        />
      </SafeAreaView>
    </ImageBackground>

  )
}

export default memo(Product)
