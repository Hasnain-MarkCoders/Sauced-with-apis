import { ImageBackground, Text, TouchableOpacity, Vibration, View, Platform, KeyboardAvoidingView, Dimensions, ActivityIndicator, FlatList } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import home from "./../../../assets/images/home.png";
import { handleText } from '../../../utils';
import { scale } from 'react-native-size-matters';
import CustomInput from '../../components/CustomInput/CustomInput';
import { useNavigation } from '@react-navigation/native';
import search from "./../../../assets/images/search_icon.png";
import ProductSearchList from '../../components/ProductSearchList/ProductSearchList';

const { height } = Dimensions.get('window'); // Get screen height dynamically

const SearchScreen = () => {
    const [query, setQuery] = useState({
        search: "",
    });
    const [data, setData] = useState();
    const [initialLoading, setInitialLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        setTimeout(() => {
            setInitialLoading(false);
        }, 1000);
    }, []);
    
    useEffect(() => {
       navigation.addListener("focus",()=>{
     
       })
    }, [data]);


    const handleIncreaseReviewCount = useCallback((id, setReviewCount)=>{
        console.log("nano")
        setData(prev=>{
            return prev.map(item=>{
                if (item._id==id){
                    setReviewCount(item?.reviewCount+1)
                    console.log(item)
                    return {...item, reviewCount:item?.reviewCount+1}
                }else{
                    return item
                }
            })
        })

    },[])
    const searchItem = useCallback(({item, index})=>{
        // console.log(item._id)
        return  <TouchableOpacity
        onPress={()=>{
            // console.log("_id", item)
            navigation.navigate("ProductDetail", {item, title:item?.name, url:item?.image, handleIncreaseReviewCount})
        }}
        style={{
            padding: scale(12),
            borderBottomWidth: 1,
            borderBottomColor: '#E0E0E0',  // Subtle divider between items
        }}
        activeOpacity={0.7}  // Makes it more interactive like a search engine item
    >
        <Text
            style={{
                color: '#333333',  // Darker text color
                fontSize: scale(14),
            }}
        >
            {item?.title}
        </Text>
    </TouchableOpacity>
    },[navigation])

    if (initialLoading) {
        return (
            <ImageBackground source={home} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#FFA100" />
            </ImageBackground>
        );
    }

   

    return (
        <ImageBackground
            source={home}
            style={{
                flex: 1,
                paddingHorizontal: scale(20),
                paddingTop: scale(32),
            }}>
            <KeyboardAvoidingView
                style={{
                    flex: 1,
                }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <View style={{ flex: 1, position: "relative" }}>
                    {/* Search Input */}
                    <View style={{ marginBottom: scale(10) }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: scale(10),
                            gap: 10,
                        }}>
                            <CustomInput
                                autoFocus={true}
                                imageStyles={{
                                    top: '50%',
                                    transform: [{ translateY: -0.5 * scale(25) }],
                                    width: scale(25),
                                    height: scale(25),
                                    aspectRatio: '1/1',
                                }}
                                isURL={false}
                                showImage={true}
                                uri={search}
                                name="search"
                                onChange={handleText}
                                updaterFn={setQuery}
                                value={query.search}
                                showTitle={false}
                                placeholder="Search for a sauce..."
                                containterStyle={{
                                    flexGrow: 1,
                                }}
                                inputStyle={{
                                    borderColor: '#FFA100',
                                    borderWidth: 1,
                                    borderRadius: 10,
                                    padding: 15,
                                    paddingLeft: scale(45),
                                }}
                            />
                        </View>
                        <TouchableOpacity onPress={() => {
                            Vibration.vibrate(10);
                            navigation.navigate('RequestASauceScreen');
                        }}>
                            <Text style={{
                                color: 'white',
                                fontSize: scale(10),
                                lineHeight: scale(13),
                                fontFamily: 'Montserrat',
                                textDecorationLine: 'underline',
                                fontWeight: '700',
                            }}>
                                Don't see what you're looking for? Request a sauce or brand.
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Search Suggestion List */}
                    {(data?.length > 0 && query?.search) && (
                        <View
                            style={{
                                backgroundColor: '#FFFFFF',  // White background like search engines
                                borderRadius: scale(8),
                                marginBottom: scale(20),
                                position: "absolute",
                                width: "100%",
                                top: scale(60),  // Adjusted based on the size of the input
                                zIndex: 1,
                                maxHeight: height * 0.3,  // Limit the height of the suggestions to make it responsive
                                shadowColor: '#000',  // Adding shadow for a slight elevation effect
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.2,
                                shadowRadius: 4,
                                elevation: 5,  // For Android shadow effect
                            }}
                        >
                            <FlatList
                                data={data}
                                extraData={data}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={(item, index)=>searchItem(item, index)}
                            />
                        </View>
                    )}

                    {/* Product Search List */}
                    <View style={{ flex: 1 }}>
                        <ProductSearchList
                        handleIncreaseReviewCount={handleIncreaseReviewCount}
                            getQueryData={setData}
                            showHeart={false}
                            searchTerm={query.search}
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};

export default SearchScreen;
