import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import ClockDigit from '../ClockDigit/ClockDigit';

const CustomTimer = ({ eventTime }) => {
    const [seconds, setSeconds] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [hours, setHours] = useState(0);
    const [days, setDays] = useState(0);

    useEffect(() => {
        const targetTime = new Date(eventTime).getTime(); // Milliseconds since epoch (UTC)
        
        const interval = setInterval(() => {
            const nowTime = new Date().getTime(); // Milliseconds since epoch (local time)
            const difference = targetTime - nowTime;

            if (difference > 0) {
                let totalSeconds = Math.floor(difference / 1000);

                const days = Math.floor(totalSeconds / (3600 * 24));
                totalSeconds %= (3600 * 24);

                const hours = Math.floor(totalSeconds / 3600);
                totalSeconds %= 3600;

                const minutes = Math.floor(totalSeconds / 60);
                const seconds = totalSeconds % 60;

                setDays(days);
                setHours(hours);
                setMinutes(minutes);
                setSeconds(seconds);
            } else {
                // Clear the interval and set everything to zero when the countdown ends
                clearInterval(interval);
                setDays(0);
                setHours(0);
                setMinutes(0);
                setSeconds(0);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [eventTime]);

    return (
        <View style={styles.container}>
            <ClockDigit digit={days} type='Days' />
            <Text style={styles.colon}>:</Text>
            <ClockDigit digit={hours} type='Hours' />
            <Text style={styles.colon}>:</Text>
            <ClockDigit digit={minutes} type='Minutes' />
            <Text style={styles.colon}>:</Text>
            <ClockDigit digit={seconds} type='Seconds' />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        gap: scale(10),
        flexDirection: 'row',
    },
    colon: {
        color: 'white',
        fontSize: scale(50),
    },
});



export default React.memo(CustomTimer);
