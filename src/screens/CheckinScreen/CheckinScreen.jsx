import React, {   useState } from 'react';
import { View, SafeAreaView, ImageBackground, ScrollView, Alert, Image, Text, TouchableOpacity, StyleSheet, Vibration } from 'react-native';
import home from './../../../assets/images/home.png';
import Header from '../../components/Header/Header';
import CustomButtom from '../../components/CustomButtom/CustomButtom';
import { useNavigation, useRoute } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';
import {  useSelector } from 'react-redux';
import { handleText } from '../../../utils.js';
import useAxios, { host } from '../../../Axios/useAxios';
import { launchImageLibrary } from 'react-native-image-picker';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomAlertModal from '../../components/CustomAlertModal/CustomAlertModal.jsx';
import user from "./../../../assets/images/user.png"
import locationIcon from "./../../../assets/images/locationIcon.png"
const cities =[
    { "city": "New York" },
    { "city": "Los Angeles" },
    { "city": "Chicago" },
    { "city": "Houston" },
    { "city": "Phoenix" },
    { "city": "Philadelphia" },
    { "city": "San Antonio" },
    { "city": "San Diego" },
    { "city": "Dallas" },
    { "city": "San Jose" },
    { "city": "Austin" },
    { "city": "Jacksonville" },
    { "city": "San Francisco" },
    { "city": "Indianapolis" },
    { "city": "Columbus" },
    { "city": "Fort Worth" },
    { "city": "Charlotte" },
    { "city": "Detroit" },
    { "city": "El Paso" },
    { "city": "Memphis" },
    { "city": "Boston" },
    { "city": "Seattle" },
    { "city": "Denver" },
    { "city": "Washington" },
    { "city": "Nashville" },
    { "city": "Baltimore" },
    { "city": "Oklahoma City" },
    { "city": "Louisville" },
    { "city": "Milwaukee" },
    { "city": "Albuquerque" },
    { "city": "Tucson" },
    { "city": "Fresno" }
]



const CheckinScreen = () => {
    const auth = useSelector(state => state.auth)
    const [filterData, setFilterData] = useState(cities||[])
    const navigation = useNavigation()
    const [loading, setLoading] = useState(false)
    const [imageUris, setImageUris] = useState([]);
    const [alertModal, setAlertModal] = useState({
        open: false,
        message: ""
    })
    const [showDropDown, setShowDropDown]  =useState(false)
    const [data, setData] = useState({
        description: "",
        select: "", 
        location:""
    });
    const route = useRoute()
    const product = route?.params?.product
    const routerNumber = route?.params?.routerNumber
    const axiosInstance = useAxios()


    const handleImagePicker = () => {
        const options = {
            mediaType: 'photo',
            // maxWidth: 300,
            // maxHeight: 300,
            quality: 1,
            selectionLimit: 0,
        };

        launchImageLibrary(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response?.error);
                Alert.alert('Error', 'Something went wrong while picking the image.');
            } else {
                const sources = response.assets.map(asset => ({
                    uri: asset?.uri,
                    type: asset?.type,
                    name: asset?.fileName,
                }));

                setImageUris(prevUris => [...prevUris, ...sources.map(source => source?.uri)]);
            }
        });
    };


    const handleImage = async (file, additionalData) => {
        const formData = new FormData();
        formData.append('images', file);
        formData.append('text', additionalData.description);
        formData.append('latitude', additionalData.latitude);
        formData.append('longitude', additionalData.longitude);
        formData.append('sauceId', additionalData.sauceId);
    
        const postData = {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + auth?.token // Auth token assumed to be necessary
            },
            body: formData
        };
        console.log(formData)
    
        try {
            const response = await fetch(`${host}/checkin`, postData);
            const responseJson = await response.json();
            console.log("response====> add check", responseJson)
            if (!response.ok) {
                throw new Error(responseJson.error || "An unknown error occurred");
            }
            
            return responseJson;
        } catch (error) {
            console.error('Upload error:', error);
            throw error; // Allows error handling in the calling function
        }
    };
    








    const handleSubmit = async () => {
        if (!data.description) {
            return   setAlertModal({
                open:true,
                message:"Please write a description."
            })
         
        }
        if (!data.location) {
            return setAlertModal({
                open:true,
                message:"Please select an option from the list."
            })
            
        }
        Vibration.vibrate(10);
        setLoading(true);
    
        const additionalData = {
            description: data.description,
            latitude: "21321",
            longitude: "32131",
            sauceId: product._id // Assuming product._id is available and correct
        };
    
        const uploadPromises = imageUris.map(uri => handleImage({
            uri,
            type: 'image/jpeg', // Assuming JPEG; adjust as needed
            name: uri.split('/').pop(), // Extract filename from URI
        }, additionalData));
    
        try {
            const results = await Promise.allSettled(uploadPromises);
            const uploadErrors = results.filter(result => result.status === 'rejected');
    
            if (uploadErrors.length > 0) {
                const errorMessage = `Failed to upload ${uploadErrors.length} image(s).`;
                console.error(errorMessage, uploadErrors);
                setAlertModal({
                    open:true,
                    message:errorMessage
                })
               
            } else {
                setAlertModal({
                    open:true,
                    message:"Check complete."
                })
                if(results[0]?.status=="fulfilled")
                    setAlertModal({
                        open:true,
                        message:results[0]?.value?.message
                    })
                    setData(
                        {
                            description: "",
                            select: "", 
                            location:""
                        }
                    )
                    setImageUris([])
                navigation.navigate("AllCheckinsScreen", {_id:product?._id, routerNumber});
            }
        } catch (error) {
            console.error('An error occurred during uploads:', error);
           return setAlertModal({
                open:true,
                message:error.message
            })
        } finally {
            setLoading(false);
        }
    };
    
    ;
    const filterfn = (search="")=>{
        if(search){
            setShowDropDown(true)
        }else{
            setShowDropDown(false)
        }
        const newData = [...cities]
       setFilterData(newData.filter(x=>x?.city?.toLowerCase()?.includes(search?.toLowerCase())))

    }
    return (
        <ImageBackground style={{ flex: 1, width: '100%', height: '100%' }} source={home}>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView

                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={{ flex: 1 }}>
                    <Header showMenu={false} cb={() => navigation.goBack()} showProfilePic={false} showDescription={false} title="Add Check-in" />
                    <View style={{ paddingHorizontal: 20, flex: 1, justifyContent: "space-between", paddingVertical: 40, paddingBottom: 100, gap: scale(10) }}>

                        <View style={{ alignItems: "center", gap: 20 }}>
                            <CustomInput
                imageStyles={{top:"4%", left:"4%", transform: [{ translateY: 10 }], width:scale(25), height:scale(25), aspectRatio:"1/1"}}

                                showImage={true}
                                multiline={true}
                                isURL={false}
                                uri={user}
                                localImage={true}
                                numberOfLines={5}
                                name="description"
                                onChange={handleText}
                                updaterFn={setData}
                                value={data.description}
                                showTitle={false}
                                placeholder="Description"
                                containterStyle={{
                                    width: "100%",
                                    flexGrow: 1,
                                }}
                                inputStyle={{
                                    borderColor: "#FFA100",
                                    backgroundColor: "#2e210a",
                                    color: "white",
                                    borderWidth: 1,
                                    borderRadius: 10,
                                    fontSize: scale(14),
                                    padding: 15,
                                    textAlignVertical: 'top',
                                    paddingLeft: scale(50)

                                }} />
                                <View style={{
                                    width:"100%",
                                    position:"relative",
                                    borderRadius:scale(12),
                                }}>

                                    <CustomInput
                                    cb={filterfn}
                                            imageStyles={{top:"50%",left:"90%", transform: [{ translateY: -0.5 * scale(25) }], width:scale(16), height:scale(20)}}
                                            isURL={false}
                                            showImage={true}
                                            uri={locationIcon}
                                        name="location"
                                        onChange={handleText}
                                        updaterFn={setData}
                                        value={data.location}
                                        showTitle={false}
                                        placeholder="Location"
                                        containterStyle={{
                                            flexGrow: 1,
                                            width:"100%",
                                            backgroundColor:"#2e210a",
                                            borderRadius:scale(12)
                                        }}
                                        inputStyle={{
                                            borderColor: "#FFA100",
                                            borderWidth: 1,
                                            borderRadius: 10,
                                            padding: 15,
                                            paddingLeft:scale(20)

                                        }} />
                                        {(showDropDown && filterData.length>0) &&<ScrollView  style={{
                                            position:"absolute",
                                            
                                            top:scale(55),
                                            borderRadius:scale(12),
                                            borderWidth:1,
                                            borderColor:"#FFA100",
                                            backgroundColor:"#2E210A",
                                            zIndex:1,
                                            width:"100%",
                                            overflow:"scroll",
                                            maxHeight:scale(200),
                                            minHeight:scale(40),
                                            padding:scale(20),
                                            paddingVertical:scale(10)
                                        }}>
                                            { filterData.map((item, index)=>{

                                              return <TouchableOpacity 
                                              key={index}
                                              style={{
                                                borderRadius:scale(12),
                                              }}
                                              onPress={()=>{
                                                setShowDropDown(false)
                                                setData(prev=>({...prev, location:item.city}))
                                              }}>
                                              <Text
                                              
                                              style={{
                                                
                                                fontSize:scale(14),
                                                color:"white",
                                                paddingVertical:scale(10)
                                              }}>
                                                    {item.city}
                                                </Text>
                                              </TouchableOpacity>
                                              
                                              
                                                
                                            })
                                        }
                                        </ScrollView >}
                                </View>
                          

                            <View style={{
                                width: "flex",
                                width: "100%",
                                flexWrap: "wrap",
                                flexDirection: "row",
                                gap: scale(20),
                                justifyContent: "center"
                            }}>
                                {imageUris.map((uri, index) => (
                                    <Image key={index} source={{ uri }} style={{
                                        width: scale(100), borderColor: "#FFA100",
                                        borderWidth: 1, height: scale(100), borderRadius: scale(12)
                                    }} />
                                ))}
                                <TouchableOpacity

                                    onPress={handleImagePicker}
                                    style={{
                                        width: imageUris[0] ? scale(100) : "100%",

                                    }}>

                                    <View style={{
                                        minHeight: scale(100),

                                        borderColor: "#FFA100",
                                        borderWidth: 1,
                                        backgroundColor: "#2e210a",
                                        borderRadius: scale(12),
                                        width: "100%",
                                        marginBottom: scale(60),
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderStyle: 'dashed'
                                    }}>
                                        <Text style={{
                                            fontSize: scale(16),
                                            lineHeight: scale(19),
                                            color: "white",
                                            fontWeight: 700
                                        }}>
                                            {imageUris[0] ? "+" : "Upload a picture"}
                                        </Text>

                                    </View>
                                </TouchableOpacity>
                            </View>

                            <CustomButtom
                            loading={loading}
                                showIcon={false}
                                buttonTextStyle={{ fontSize: scale(16) }}
                                buttonstyle={{ width: "100%", borderColor: "#FFA100", backgroundColor: "#2e210a", paddingHorizontal: scale(15), paddingVertical: scale(13), display: "flex", gap: 10, flexDirection: "row-reverse", alignItems: "center", justifyContent: "center" }}
                                onPress={() => handleSubmit()}
                                title={"Submit"}
                            />
                            <View style={{
                                borderColor: "#FFA100", backgroundColor: "#2e210a"
                            }}>

                            </View>

                        </View>
                    </View>
             
                    <CustomAlertModal
                    title={alertModal?.message}
                    modalVisible={alertModal?.open}
                    setModalVisible={() => setAlertModal({
                        open: false,
                        messsage: ""
                    })}
                />
                </ScrollView>
            </SafeAreaView>
         
        </ImageBackground>
    );
};

export default CheckinScreen;


const styles = StyleSheet.create({
    dropdownButtonStyle: {
        width: "100%",
        height: 50,
        backgroundColor: "#2e210a",
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderColor: "#FFA100",
        borderWidth: 1
    },
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: 'white',
        fontSize:scale(14)
    },
    dropdownButtonArrowStyle: {
        fontSize: 28,
        color:"#FFA100"
    },
    dropdownButtonIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
    dropdownMenuStyle: {
        backgroundColor: "#2e210a",
        borderColor: "#FFA100",
        borderWidth: 1,
        borderRadius: 8,
    },
    dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        borderRadius: 8,
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: scale(14),
        fontWeight: '500',
        color: 'white',
    },
    dropdownItemIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
});