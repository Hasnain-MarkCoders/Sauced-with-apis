import { Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import React, { useRef, useState } from 'react';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAP_API_KEY } from '@env';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useRoute } from '@react-navigation/native';
import NotFound from '../../components/NotFound/NotFound';
import { scale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import yellowChilli from './../../../assets/images/yellow-chilli.png';
import redChilli from './../../../assets/images/red-chilli.png';
import darkArrow from './../../../assets/images/darkArrow.png';

// const currentCoords = { latitude: 24.8615, longitude: 67.0099 }
// const targetCoords = { latitude: 24.7967, longitude: 67.0305 }
const MapDirectionsScreen = ({
    showMarkers=true
})=> {

    const Route = useRoute()
    const targetCoords = Route?.params?.targetCoords||null
    const currentCoords = Route?.params?.currentCoords||null
    const mapRef = useRef(null);
    const navigation = useNavigation()
    return (
        <SafeAreaView style={{
            flex: 1,
            justifyContent:"center",
            alignItems:"center",
            backgroundColor:"black",
            position:"relative"
        }}>
               <TouchableOpacity
          style={{
            position: 'absolute',
            width: scale(20),
            height: scale(20),
            zIndex: 2,
            top: scale(25),
            left: scale(8)
          }}
          onPress={() => navigation.goBack()}>
          <Image
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'contain',
            }}
            source={darkArrow}
          />
        </TouchableOpacity>
                {currentCoords && targetCoords ? <MapView
                    provider={PROVIDER_GOOGLE}
                    ref={mapRef}
                      style={{ width: "100%", height: "100%"}}
                      zoomTapEnabled={true}
                      initialRegion={{
                        ...currentCoords,
                        latitudeDelta: 5,
                        longitudeDelta:5,
                      }}

                    >
            {!!currentCoords && showMarkers &&<Marker
                          anchor={{ x: 0.5, y: 0.5 }}
                          coordinate={{
                            latitude: parseFloat(currentCoords?.latitude),
                            longitude: parseFloat(currentCoords?.longitude),
                          }}>
                          <View >
                            <Image
                              source={yellowChilli}
                              style={[{ width: scale(50), height: scale(50) }]}
                            />
                          </View>
                        </Marker>}
                        {!!targetCoords && showMarkers &&<Marker
                          anchor={{ x: 0.5, y: 0.5 }}
                          coordinate={{
                            latitude: parseFloat(targetCoords?.latitude),
                            longitude: parseFloat(targetCoords?.longitude),
                          }}>
                           <View >
                            <Image
                              source={redChilli}
                              style={[{ width: scale(50), height: scale(50) }]}
                            />
                          </View>
                        </Marker>}
            {!!currentCoords && !!targetCoords && <MapViewDirections
                onError={(errorMessage) => {
                    console.error('MapViewDirections Error:', errorMessage);
                }}
                origin={{
                    latitude: parseFloat(currentCoords?.latitude),
                    longitude: parseFloat(currentCoords?.longitude),
                }}
                destination={{
                    latitude: parseFloat(targetCoords?.latitude),  // Fixed spelling
                    longitude: parseFloat(targetCoords?.longitude),  // Fixed spelling
                }}
                apikey={GOOGLE_MAP_API_KEY}
                strokeWidth={6}
                strokeColor="#FFA100"
                onReady={result => {
                    mapRef?.current?.fitToCoordinates(result?.coordinates, {
                        edgePadding: {
                            top: 50,
                            right: 50,
                            bottom: 50,
                            left: 50,
                        },
                        animated: true,
                    });
                }}
            />}
            </MapView>
            
            :
            <>
            
            <NotFound
            title='Coordinates not found!'
            
            />

<TouchableOpacity
          style={{
            marginTop:scale(10)
          }}
          onPress={() => {
            navigation.goBack()
          }}>
          <View
            style={{
              backgroundColor: '#FFA500', // Set the background color in the View
              borderRadius: scale(20), // Apply the borderRadius here
              paddingHorizontal: scale(10),
              paddingVertical: scale(5),
            }}>
            <Text
              style={{
                color: '#000',
                fontSize: scale(12),
              }}>
              Go back
            </Text>
          </View>
        </TouchableOpacity>
            </>
        
        }
        </SafeAreaView>
    );
};

export default MapDirectionsScreen;
