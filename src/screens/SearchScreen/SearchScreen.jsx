import { Image, ImageBackground, Text, TouchableOpacity, Vibration, View,   Platform,KeyboardAvoidingView, Dimensions } from 'react-native'
import React, {  useEffect, useState } from 'react'
import home from "./../../../assets/images/home.png"
import {  handleText } from '../../../utils'
import { scale } from 'react-native-size-matters'
import qr from "./../../../assets/images/qr.png"
import CustomInput from '../../components/CustomInput/CustomInput'
import { useNavigation } from '@react-navigation/native'
import search from "./../../../assets/images/search_icon.png";
import ProductSearchList from '../../components/ProductSearchList/ProductSearchList'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const SearchScreen = () => {
    const [query, setQuery] = useState({
        search: "",
    });
    const navigation = useNavigation()

    return (

   <ImageBackground

            source={home}
            style={{
                flex: 1,
                paddingHorizontal:scale(20),
                paddingTop:scale(32),
            }}>
        {/* <SkeletonPlaceholder speed={1600} backgroundColor='#FFA100' highlightColor={"#ffffff"} borderRadius={4}>
        <View style={{gap:scale(10), maxWidth:scale(110) }}>
            <View style={{  height: 20, borderRadius: 4 }} />
            <View style={{  height: 20, borderRadius: 4 }} />
            <View style={{  height: 20, borderRadius: 4 }} />
            <View style={{gap:scale(10), flexDirection:"row", justifyContent:"space-between"}}>

            <View style={{ marginTop: 6,flexBasis:scale(20), flexGrow:1, height: 20, borderRadius: 4 }} />
            <View style={{ marginTop: 6, width: 20, height: 20, borderRadius: 4 }} />
            </View>


        </View>
      </SkeletonPlaceholder> */}

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
                    autoFocus={true}
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

                    {/* <TouchableOpacity onPress={() => {navigation.navigate("QRScreen") }}>
                        <View>

                            <Image source={qr} style={{
                                 borderRadius: scale(10),
                                 width: scale(50),
                                 height: scale(50)
                            }} />
                        </View>
                    </TouchableOpacity> */}
                </View>
                <TouchableOpacity onPress={()=>{
                                    Vibration.vibrate(10)
                                    navigation.navigate("RequestASauceScreen")
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
                <ProductSearchList
                searchTerm={query?.search}/>

            </View>
</KeyboardAvoidingView>
        </ImageBackground>


    )
}

export default SearchScreen