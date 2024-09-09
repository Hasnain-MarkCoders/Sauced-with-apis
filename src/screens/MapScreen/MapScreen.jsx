import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, Dimensions, PermissionsAndroid, Platform, Text, StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { useNavigation, useRoute } from '@react-navigation/native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geolocation from '@react-native-community/geolocation';
import MapView, { Marker } from 'react-native-maps';
import darkArrow from "./../../../assets/images/darkArrow.png";

const { width } = Dimensions.get('window');
const MapScreen = () => {
  const navigation = useNavigation();
  const route = useRoute()
  const lng= route?.params?.lng
  const lat= route?.params?.lat
  const handleEventCoords = route?.params?.fn

  const [region, setRegion] = useState({
    latitude:lat ,
    longitude:lng,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  })
  // const [hasLocationPermission, setHasLocationPermission] = useState(false);
  // const [locationFetched, setLocationFetched] = useState(false);

  // useEffect(() => {
  //   const requestLocationPermission = async () => {
  //     if (Platform.OS === 'ios') {
  //       setHasLocationPermission(true);
  //       fetchLocation();
  //       return;
  //     }

  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //       {
  //         title: "Location Access Permission",
  //         message: "We need access to your location to show where you are on the map",
  //         buttonNeutral: "Ask Me Later",
  //         buttonNegative: "Cancel",
  //         buttonPositive: "OK"
  //       }
  //     );

  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       setHasLocationPermission(true);
  //       fetchLocation();
  //     } else {
  //       console.log("Location permission denied");
  //       setHasLocationPermission(false);
  //     }
  //   };

  //   const fetchLocation = () => {
  //     Geolocation.getCurrentPosition(
  //       position => {
  //         setRegion({
  //           latitude: position.coords.latitude,
  //           longitude: position.coords.longitude,
  //           latitudeDelta: 0.005,
  //           longitudeDelta: 0.005,
  //         });
  //         setLocationFetched(true);
  //       },
  //       error => {
  //         console.error("Location fetching error: ", error);
  //         setLocationFetched(false);
  //         alert('Please enable location services on your device and try again.');
  //       },
  //       { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
  //     );
  //   };

  //   requestLocationPermission();
  // }, []);

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
          destination:data?.description
        })
      
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
        // showsUserLocation={hasLocationPermission}
        followsUserLocation={true}
      >
        {/* {locationFetched && <Marker coordinate={region} />}
         */}
         {!!region&& <Marker coordinate={region}/>}
      </MapView>

      {/* {!hasLocationPermission && (
        <Text style={styles.errorText}>Location permission is required to show the map marker.</Text>
      )} */}
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
