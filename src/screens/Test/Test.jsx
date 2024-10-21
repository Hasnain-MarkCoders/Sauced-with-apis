import { ImageBackground, ActivityIndicator} from 'react-native';
import React, { useEffect, useState } from 'react';
import home from "./../../../assets/images/home.png";
import { scale } from 'react-native-size-matters';
import TestComponent from '../../components/Test componets/TestSearchListSauces/TestSearchListSauces';
const Test = () => {

    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setInitialLoading(false);
        }, 1000);
    }, []);
    
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
            <TestComponent/>
        </ImageBackground>
    );
};

export default Test;
