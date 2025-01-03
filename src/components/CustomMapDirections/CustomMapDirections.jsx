import { View } from 'react-native';
import React, { forwardRef } from 'react';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAP_API_KEY } from '@env';
import { Marker } from 'react-native-maps';

const CustomMapDirections = forwardRef(({
    currentCoords =  null,
    targetCoords = null,  // Fixed spelling
    showMarkers=false
}, ref) => {
    return (
        <View>
            
            {!!currentCoords && showMarkers &&<Marker
                          anchor={{ x: 0.5, y: 0.5 }}
                          coordinate={{
                            latitude: parseFloat(currentCoords?.latitude),
                            longitude: parseFloat(currentCoords?.longitude),
                          }}>
                        
                        </Marker>}
                        {!!targetCoords && showMarkers &&<Marker
                          anchor={{ x: 0.5, y: 0.5 }}
                          coordinate={{
                            latitude: parseFloat(targetCoords?.latitude),
                            longitude: parseFloat(targetCoords?.longitude),
                          }}>
                         
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
                    ref?.current?.fitToCoordinates(result?.coordinates, {
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
            
        </View>
    );
});

export default CustomMapDirections;
