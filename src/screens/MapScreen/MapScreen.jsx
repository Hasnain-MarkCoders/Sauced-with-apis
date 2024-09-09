import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, Dimensions, PermissionsAndroid, Platform, Text, StyleSheet, Alert } from 'react-native';
import { scale } from 'react-native-size-matters';
import { useNavigation, useRoute } from '@react-navigation/native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geolocation from '@react-native-community/geolocation';
import MapView, { Marker } from 'react-native-maps';
import darkArrow from "./../../../assets/images/darkArrow.png";
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
const { width } = Dimensions.get('window');
const MapScreen = () => {
  const navigation = useNavigation();
  const route = useRoute()
  const lng= route?.params?.lng
  const lat= route?.params?.lat
  const handleEventCoords = route?.params?.fn
const auth = useSelector(state=>state?.auth)
console.log(auth?.token)
  const [region, setRegion] = useState({
    latitude:lat ,
    longitude:lng,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  })

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Image style={{
            width:"100%", 
            height:"100%",
            resizeMode:"contain"
        }} source={darkArrow} />
      </TouchableOpacity>

      <GooglePlacesAutocomplete
        placeholder='Search for places'
        fetchDetails={true}
        onPress={(data, details = null) => {
          setRegion({
          latitude: details.geometry.location?.lat,
          longitude: details.geometry.location?.lng,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        })
        

        handleEventCoords({
          latitude: details.geometry.location?.lat,
          longitude: details.geometry.location?.lng,
          destination:data?.description,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        })
        Toast.show({
          type: 'success',
          text1: 'Address selected successfully ✅',
          text2: 'Press arrow button to continue'
        });
      
      }}
        query={{
          key: 'AIzaSyAkJ06-4A1fY1ekldJUZMldHa5QJioBTlY', // Replace this with your actual API key
          language: 'en',
        }}
        styles={{
          textInput: {
            backgroundColor: '#FFFFFF',
            height: scale(40),
            borderRadius: 5,
            fontSize: 15,
          },
          container: {
            position: 'absolute',
            width: '74%',
            top: scale(8),
            left: width * 0.12,
            zIndex: 1,
          }
        }}
      />
      <MapView
        style={styles.map}
        region={region}
        followsUserLocation={true}
      >
     
         {!!region&& <Marker coordinate={region}/>}
      </MapView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative"
  },
  backButton: {
    position: 'absolute',
    width:scale(20),
    height:scale(20),
    zIndex: 2,
    top: scale(20),
    left: scale(15),
  },
  map: {
    flex: 1
  },
  errorText: {
    position: 'absolute',
    top: '50%',
    alignSelf: 'center',
    color: 'red'
  }
});

export default MapScreen;
