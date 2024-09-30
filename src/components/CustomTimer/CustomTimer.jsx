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
        // Parse the eventTime string into a JavaScript Date object
        const targetDate = new Date(eventTime);

        const interval = setInterval(() => {
            const now = new Date();
            const difference = targetDate - now;

            if (difference > 0) {
                // Calculate days, hours, minutes, and seconds
                setDays(Math.floor(difference / (1000 * 60 * 60 * 24)));
                setHours(Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
                setMinutes(Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)));
                setSeconds(Math.floor((difference % (1000 * 60)) / 1000));
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
