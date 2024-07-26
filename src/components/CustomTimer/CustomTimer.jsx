import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import ClockDigit from '../ClockDigit/ClockDigit';

const CustomTimer = () => {
    // const [timeLeft, setTimeLeft] = useState('');
    const [seconds , setSeconds] = useState(null)
   const [minutes , setMinutes] = useState(null)
   const [hours , setHours] = useState(null)


    useEffect(() => {
        // Set the target date once when the component mounts
        const target = new Date();
        target.setDate(target.getDate() + 3); // Set target date to 3 days from now

        const interval = setInterval(() => {
            const now = new Date();
            const difference = target - now;
            console.log(Math.floor(difference / (1000 * 60 * 60)))
            // Calculate hours, minutes, and seconds
             setHours(Math.floor(difference / (1000 * 60 * 60)))
             setMinutes(Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)))
             setSeconds(Math.floor((difference % (1000 * 60)) / 1000))

            // Update the state with the new time left
            

            // Clear the interval if the countdown is complete
            if (difference < 0) {
                clearInterval(interval);
                // setTimeLeft('00 : 00 : 00');
            }
        }, 1000);
        return () => clearInterval(interval);

    }, []);

    return (
        <View style={styles.container}>
            <ClockDigit digit={hours} type='Hours'/>
            <Text style={{
                color:"white",
                fontSize:scale(50)
            }}>
                :
            </Text>
            <ClockDigit digit={minutes} type='Minutes'/>
            <Text style={{
                color:"white",
                fontSize:scale(50)
            }}>
                :
            </Text>

            <ClockDigit digit={seconds} type='Seconds'/>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        gap:scale(10),
        flexDirection:"row"
    },
    timerText: {
        fontSize: scale(50),
        fontWeight: '800',
        color: "white",
    }
});

export default React.memo(CustomTimer);
