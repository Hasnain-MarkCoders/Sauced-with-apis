import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import ClockDigit from '../ClockDigit/ClockDigit';

const CustomTimer = ({ eventTime }) => {
    const [seconds, setSeconds] = useState(null);
    const [minutes, setMinutes] = useState(null);
    const [hours, setHours] = useState(null);

    useEffect(() => {
        // Convert the eventTime from Unix timestamp to JavaScript Date object
        const target = new Date(eventTime * 1000);

        const interval = setInterval(() => {
            const now = new Date();
            const difference = target - now;

            // Update hours, minutes, and seconds
            setHours(Math.floor(difference / (1000 * 60 * 60)));
            setMinutes(Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)));
            setSeconds(Math.floor((difference % (1000 * 60)) / 1000));

            // Clear the interval if the countdown is complete
            if (difference < 0) {
                clearInterval(interval);
                setSeconds(0);
                setMinutes(0);
                setHours(0);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [eventTime]);

    return (
        <View style={styles.container}>
            <ClockDigit digit={hours} type='Hours' />
            <Text style={styles.colon}>
                :
            </Text>
            <ClockDigit digit={minutes} type='Minutes' />
            <Text style={styles.colon}>
                :
            </Text>
            <ClockDigit digit={seconds} type='Seconds' />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        gap: scale(10),
        flexDirection: "row"
    },
    colon: {
        color: "white",
        fontSize: scale(50)
    },
    timerText: {
        fontSize: scale(50),
        fontWeight: '800',
        color: "white",
    }
});

export default React.memo(CustomTimer);
