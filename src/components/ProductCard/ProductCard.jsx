import { Image, Text, TouchableOpacity, View, Linking, Alert } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { scale } from 'react-native-size-matters'
import { useDispatch, useSelector } from 'react-redux'
import emptyheart from "./../../../assets/images/emptyHeart.png"
import filledHeart from "./../../../assets/images/filledHeart.png"
// import Lightbox from 'react-native-lightbox';
import Lightbox from 'react-native-lightbox-v2';
import wishlist_icon from "./../../../assets/images/wishlist_icon.png"
import wishlist_filled from "./../../../assets/images/wishlist_filled.png"
import CustomRating from '../CustomRating/CustomRating'
import Snackbar from 'react-native-snackbar'
import { useNavigation } from '@react-navigation/native'
import useAxios from '../../../Axios/useAxios'
import { handleToggleTopRatedSauce, handleTopRatedSauces } from '../../../android/app/Redux/topRatedSauces'
import { handleToggleFeaturedSauce } from '../../../android/app/Redux/featuredSauces'
import { handleFavoriteSauces, handleIncreaseReviewCountOfFavoriteSauce, handleRemoveSauceFromFavouriteSauces, handleToggleFavoriteSauce } from '../../../android/app/Redux/favoriteSauces'
import { handleToggleCheckedInSauce } from '../../../android/app/Redux/checkedInSauces'
import { handleToggleSauceListOne } from '../../../android/app/Redux/saucesListOne'
import { handleToggleSauceListTwo } from '../../../android/app/Redux/saucesListTwo'
import { handleToggleSauceListThree } from '../../../android/app/Redux/saucesListThree'
import { handleToggleLikeWishlistSauce, handleToggleWishList } from '../../../android/app/Redux/wishlist'
import { Camera } from 'lucide-react-native';
import {Camera as VisionCamera, useCameraDevices} from 'react-native-vision-camera';
import { handleToggleReviewedSauce } from '../../../android/app/Redux/reviewedSauces'
const ProductCard = ({
    url = "",
    title = "",
    setshowListModal = () => { },
    product = {},
    sauceType = "",
    mycb=()=>{},
    handleIncreaseReviewCount=()=>{},
    handleLike=()=>{},
    setSelected=()=>{}
}) => {
    const wishListSlices = useSelector(state => state?.wishlist)
    const isInWishList=(id=product?._id)=>{
        return !!wishListSlices.find(item=>item?._id==id)

    }

    // const count = useSelector(state=>state?.count)
    const [loadings, setLoadings] = useState({
        isWishListLoading:false
      })
    const axiosInstance = useAxios()
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const [LightBox, setLightBox] = useState(false)
    const [reviewCount, setReviewCount] = useState(product?.reviewCount)
    const [loading, setLoading] = useState(false)

    const [productStatus, setproductStatus] = useState({
        isChecked: product["hasLiked"],
        isAddedToWishList: isInWishList(),
        isAddedToList: false
    })

    const camera = useRef(null);
  const devices = useCameraDevices();
  const device = devices.back;

    const handleToggleLike = async () => {
        handleLike(product?._id, setproductStatus)
        setSelected((prev)=>({
            ...prev,
            isChecked: !prev?.isChecked
          }))
        setLoading(true);
        try {
            const res = await axiosInstance.post(`/like-sauce`, { sauceId: product?._id });
            console.log(res.data)
            if (sauceType == "toprated") {
                dispatch(handleToggleTopRatedSauce(product?._id))
                  if(productStatus?.isChecked){
                    dispatch(handleRemoveSauceFromFavouriteSauces(product?._id))
                }else{
                    dispatch(handleFavoriteSauces([{...product, hasLiked:true}]))
                }
            }
            if (sauceType == "featured") {
                console.log("sauceType============================>", sauceType)
                dispatch(handleToggleFeaturedSauce(product?._id))
                   if(productStatus?.isChecked){
                    dispatch(handleRemoveSauceFromFavouriteSauces(product?._id))
                }else{
                    dispatch(handleFavoriteSauces([{...product, hasLiked:true}]))
                }
               
             
            }
            if (sauceType == "favourite") {
                dispatch(handleToggleFavoriteSauce(product?._id))
               if(productStatus?.isChecked){
                    dispatch(handleRemoveSauceFromFavouriteSauces(product?._id))
                }else{
                    dispatch(handleFavoriteSauces([{...product, hasLiked:true}]))
                }
            // dispatch(handleRemoveSauceFromFavouriteSauces(item?._id))

            }
            if (sauceType == "checkedin") {
                dispatch(handleToggleCheckedInSauce(product?._id))
                if(productStatus?.isChecked){
                    dispatch(handleRemoveSauceFromFavouriteSauces(product?._id))
                }else{
                    dispatch(handleFavoriteSauces([{...product, hasLiked:true}]))
                }
            }

            if (sauceType=="reviewed"){
                dispatch(handleToggleReviewedSauce(item?._id))
                if(selected){
                    dispatch(handleRemoveSauceFromFavouriteSauces(item?._id))
                    }else{
                        dispatch(handleFavoriteSauces([{...item, hasLiked:true} ]))
                    }
            }
  
            if (sauceType=="wishlist"){
              dispatch(handleToggleLikeWishlistSauce(item?._id))
              if(selected){
                  dispatch(handleRemoveSauceFromFavouriteSauces(item?._id))
                  }else{
                      dispatch(handleFavoriteSauces([{...item, hasLiked:true} ]))
                  }
          }
            if (sauceType == 1) {
                dispatch(handleToggleSauceListOne(product?._id))
                if(productStatus?.isChecked){
                    dispatch(handleRemoveSauceFromFavouriteSauces(product?._id))
                }else{
                    dispatch(handleFavoriteSauces([{...product, hasLiked:true}]))
                }
            }
            if (sauceType == 2) {
                dispatch(handleToggleSauceListTwo(product?._id))
                if(productStatus?.isChecked){
                    dispatch(handleRemoveSauceFromFavouriteSauces(product?._id))
                }else{
                    dispatch(handleFavoriteSauces([{...product, hasLiked:true}]))
                }
            }
            if (sauceType == 3) {
                dispatch(handleToggleSauceListThree(product?._id))
                if(productStatus?.isChecked){
                    dispatch(handleRemoveSauceFromFavouriteSauces(product?._id))
                }else{
                    dispatch(handleFavoriteSauces([{...product, hasLiked:true}]))
                }
            }
        } catch (error) {
            console.error('Failed to like / dislike:', error);
        } finally {
            setLoading(false);
        }
    }
    const handleWishlist = useCallback(async()=>{
        try{
          setLoadings(prev=>({
            ...prev,
            isWishListLoading:true
          }))
          const res = await axiosInstance.post(`/wishlist`, {
            params: {
                sauceId:product?._id
            }
        });
      
        }catch(error){
      
        }finally{
          setLoadings(prev=>({
            ...prev,
            isWishListLoading:false
          }))
      
        }
      
      },[])

      useEffect(()=>{
        console.log(product?.reviewCount)
      },[product?.reviewCount])
   

    return (
        <View style={{
            width: "100%",
            paddingVertical: scale(20),
            gap: scale(20),
        }}>
            <View style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                gap: scale(20),
            }}>
                <View style={{
                }}>

                    <Lightbox
                        // activeProps={{ resizeMode: LightBox ? 'contain' : "cover" }}
                        activeProps={{
                            resizeMode: 'contain',
                            style: {
                                width: '100%',
                                height: '100%',
                                borderRadius: 0,
                                borderColor: 'transparent',
                                borderWidth: 0,
                            },
                        }}
                        // springConfig={{ tension: 0, friction: 0 }}
                        // onOpen={() => setLightBox(true)}
                        // willClose={() => setLightBox(false)}
                    >
                        <Image
                            style={{
                                width: scale(120),
                                height: scale(150),
                                minWidth: scale(120),
                                minHeight: scale(150),
                                borderRadius: scale(10),
                                borderColor: '#FFA100',
                                borderWidth: scale(1),
                            }}
                            source={{ uri: url }}
                        />
                    </Lightbox>
                </View>
                <View style={{
                    gap: scale(14),
                    flexDirection: "row",
                    flexGrow: 1,
                    flexShrink: 1,
                    justifyContent: "space-between",

                }}>

                    <View style={{
                        gap: scale(5),
                        flexShrink: 0,
                        flexGrow: 1,
                    }}>
                        <View>
                            <Text

                                style={{
                                    color: "white",
                                    fontWeight: 600,
                                    fontSize: scale(17),
                                    lineHeight: scale(24),
                                }}>{product?.name?product?.name:"N/A"}</Text>
                        </View>

                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}>
                            <TouchableOpacity onPress={() => {
                                navigation.navigate("AllReviews", { _id: product?._id,
                                    //  setReviewCount, handleIncreaseReviewCount , reviewCount
                                    item:product,title:product?.name, url:product?.image, sauceType, mycb, handleIncreaseReviewCount, setReviewCount, reviewCount,handleLike
                                    })
                            }}>
                                <Text style={{
                                    color: "white",
                                    fontWeight: 500,
                                    fontSize: scale(12),
                                    lineHeight: scale(14),
                                    textDecorationStyle:"solid",
                                    textDecorationLine:"underline"
                                }}>{ !isNaN(reviewCount) && reviewCount>-1 ?`${reviewCount} Reviews`:"N/A"}</Text>
                                <CustomRating
                                    initialRating={product?.averageRating}
                                    ratingContainerStyle={{
                                        pointerEvents: "none",
                                    }

                                    } />
                            </TouchableOpacity>

                            <View style={{
                                flexDirection: "row",
                                gap: scale(10),
                                alignItems:"center"
                            }}>

                                <TouchableOpacity
                                    onPress={() => {
                                        if(sauceType){
                                            setproductStatus(prev => ({
                                                ...prev,
                                                isChecked: !prev.isChecked
                                            }));
                                        }
                                        Snackbar.show({
                                            text: !productStatus.isChecked ? 'Liked' : "Unliked",
                                            duration: Snackbar.LENGTH_SHORT,
                                            // action: {
                                            //     text: 'UNDO',
                                            //     textColor: '#FFA100',
                                            //     onPress: () => {
                                            //         // if(sauceType){
                                            //         //     setproductStatus(prev => ({
                                            //         //         ...prev,
                                            //         //         isChecked: !prev.isChecked
    
                                            //         //     }))
                                            //         // }

                                            //         handleToggleLike()
                                            //     },
                                            // },
                                        });
                                        handleToggleLike()

                                    }}
                                >
                                    <Image style={{
                                        width: scale(15),
                                        height: scale(15),
                                        objectFit: "contain"
                                    }} source={productStatus.isChecked ? filledHeart : emptyheart} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                disabled={loadings?.isWishListLoading}
                                    onLongPress={() => {
                                        setshowListModal(true)
                                    }}
                                    onPress={() => {
                                        setproductStatus(prev => ({
                                            ...prev,
                                            isAddedToWishList: !prev.isAddedToWishList

                                        }));
                                        dispatch(handleToggleWishList(product))
                                        handleWishlist()
                                        Snackbar.show({
                                            text: !productStatus.isAddedToWishList ? 'You Added this product in Wishlist.' : "You removed this product from Wishlist.",
                                            duration: Snackbar.LENGTH_SHORT,
                                            // action: {
                                            //     text: 'UNDO',
                                            //     textColor: '#FFA100',
                                            //     onPress: () => {
                                            //         setproductStatus(prev => ({
                                            //             ...prev,
                                            //             isAddedToWishList: false

                                            //         }));
                                            //         !loadings?.isWishListLoading && handleWishlist()


                                            //     },
                                            // },
                                        });
                                    }}
                                >
                                    <Image style={{
                                        width: scale(15),
                                        height: scale(15),
                                        objectFit: "contain"
                                    }} source={productStatus.isAddedToWishList ? wishlist_filled : wishlist_icon} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            <View style={{
                flexDirection: "row",
                gap: scale(10),
                flex: 1, alignItems: "center",
                justifyContent: "space-between"
            }}>
                <View style={{
                    alignItems: "flex-start",
                    gap: scale(20),
                }}>

                    <View style={{ flexDirection: "row", gap: scale(20), alignItems: "flex-start", }}>

                        <View>
                            <Text style={{
                                color: "white"
                            }}>
                               Find on Company Site
                            </Text>
                            <TouchableOpacity onPress={() => {
                                product?.websiteLink && Linking.openURL(product?.websiteLink)
                            }}>
                                <Text
                                    // numberOfLines={1}
                                    ellipsizeMode='tail'
                                    style={{
                                        maxWidth: scale(110),
                                        color: "#FFA100",
                                        fontWeight: 600,
                                        fontSize: scale(12),
                                        lineHeight: scale(25),
                                        textDecorationStyle:"solid",
                                        textDecorationLine:product?.websiteLink ?"underline":"none"
                                    }}>{product?.websiteLink?"Visit Website":"Website Link not available."}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{
                            width: scale(1),
                            height: "80%",
                            backgroundColor: "#FFA100",
                        }}>

                        </View>
                        <View>
                            <Text style={{
                                color: "white"
                            }}>
                                Find On Amazon
                            </Text>
                            <TouchableOpacity onPress={() => {
                                product?.productLink &&Linking.openURL(product?.productLink)
                            }}>
                                <Text
                                    // numberOfLines={1}
                                    ellipsizeMode='tail'
                                    style={{
                                        maxWidth: scale(110),
                                        color: "#FFA100",
                                        fontWeight: 600,
                                        fontSize: scale(12),
                                        lineHeight: scale(25),
                                         textDecorationStyle:"solid",
                                        textDecorationLine:product?.productLink ?"underline":"none"
                                    }}>{product?.productLink?"Visit Amazon":"Not available on Amazon"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                {/* <View >
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}>
                        <View style={{
                            alignItems: "center",
                            gap: scale(10)
                        }}>
                            <View style={{
                                gap: scale(1),

                            }}>

                                <Text style={{
                                    color: "#FFA100",
                                    textAlign: "center",
                                    fontWeight: 600,
                                    fontSize: scale(30),
                                    lineHeight: scale(36),
                                }}>{product?.checkIn}</Text>
                                <Text style={{
                                    color: "white",
                                    fontWeight: 600,
                                    fontSize: scale(10),
                                    lineHeight: scale(25),
                                    marginTop: scale(-6)
                                }}>Check-ins</Text>
                            </View>
                        </View>
                    </View>
                </View> */}
            </View>
            <View style={{ flexDirection: "row", flexGrow: 1, gap: scale(10),  alignItems:"center" }}>
                <View style={{flexDirection: "row", flexGrow: 1, gap: scale(10)}}>

                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate("AddReview", { sauceId: product?._id ,item:product,title:product?.name, url:product?.image, sauceType, mycb, handleIncreaseReviewCount, setReviewCount, reviewCount, handleLike})

                    }}
                    style={{
                        paddingHorizontal: scale(10),
                        paddingVertical: scale(6),
                        backgroundColor: "#FFA100",
                        borderRadius: scale(5),
                        elevation: scale(5),
                        alignSelf: "flex-end",

                    }}>
                    <Text style={{
                        color: "black",
                        fontWeight: "700"

                    }}>Add Review</Text>



                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate("Checkin", { routerNumber:3, photo:{}, fn:()=>{},item:product,title:product?.name, url:product?.image, sauceType, mycb, handleIncreaseReviewCount, setReviewCount, reviewCount, handleLike})

                    }}
                    style={{
                        paddingHorizontal: scale(10),
                        paddingVertical: scale(6),
                        backgroundColor: "#FFA100",
                        borderRadius: scale(5),
                        elevation: scale(5),
                        alignSelf: "flex-end",

                    }}>
                    <Text style={{
                        color: "black",
                        fontWeight: "700"

                    }}>Check-in</Text>


                </TouchableOpacity>
                </View>

 <View >
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}>
                        <View style={{
                            alignItems: "center",
                            gap: scale(10)
                        }}>
                            <View style={{
                                gap: scale(1),

                            }}>

                                <Text style={{
                                    color: "#FFA100",
                                    textAlign: "center",
                                    fontWeight: 600,
                                    fontSize: scale(30),
                                    lineHeight: scale(36),
                                }}>{!isNaN(product?.checkIn) && product?.checkIn>-1 ?product?.checkIn:"N/A"}</Text>
                                <Text style={{
                                    color: "white",
                                    fontWeight: 600,
                                    fontSize: scale(10),
                                    lineHeight: scale(25),
                                    marginTop: scale(-6)
                                }}>Check-ins</Text>
                            </View>
                        </View>
                    </View>
                </View>
                {/* <TouchableOpacity
                    onPress={() => {
                        console.log("has")
                        handleIncreaseReviewCount(product?._id, setReviewCount)
                        // handleIncreaseReviewCount()
                        // dispatch(handleIncreaseReviewCountOfFavoriteSauce({_id:product?._id, setReviewCount}))
                        console.log("nain")
                    }}
                    style={{
                        paddingHorizontal: scale(10),
                        paddingVertical: scale(6),
                        backgroundColor: "#FFA100",
                        borderRadius: scale(5),
                        elevation: scale(5),
                        alignSelf: "flex-end",

                    }}>
                    <Text style={{
                        color: "black",
                        fontWeight: "700"

                    }}>test</Text>


                </TouchableOpacity> */}

            </View>


        </View>
    )
}

export default ProductCard
