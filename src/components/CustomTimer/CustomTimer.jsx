import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import ClockDigit from '../ClockDigit/ClockDigit';

const calculateTimeDifference = (startDate, endDate) => {
    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    let days = endDate.getDate() - startDate.getDate();
    let hours = endDate.getHours() - startDate.getHours();
    let minutes = endDate.getMinutes() - startDate.getMinutes();
    let seconds = endDate.getSeconds() - startDate.getSeconds();

    if (seconds < 0) {
        seconds += 60;
        minutes--;
    }
    if (minutes < 0) {
        minutes += 60;
        hours--;
    }
    if (hours < 0) {
        hours += 24;
        days--;
    }
    if (days < 0) {
        const monthAgo = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
        days += monthAgo.getDate();
        months--;
    }
    if (months < 0) {
        months += 12;
        years--;
    }

    return { years, months, days, hours, minutes, seconds };
};

const CustomTimer = ({ eventTime }) => {
    const [years, setYears] = useState(0);
    const [months, setMonths] = useState(0);
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const targetDate = new Date(eventTime);

        const interval = setInterval(() => {
            const nowDate = new Date();
            if (targetDate > nowDate) {
                const timeDiff = calculateTimeDifference(nowDate, targetDate);
                setYears(timeDiff.years);
                setMonths(timeDiff.months);
                setDays(timeDiff.days);
                setHours(timeDiff.hours);
                setMinutes(timeDiff.minutes);
                setSeconds(timeDiff.seconds);
            } else {
                clearInterval(interval);
                setYears(0);
                setMonths(0);
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
            {years > 0 ? (
                <>
                    <ClockDigit digit={years} type='Years' />
                    <Text style={styles.colon}>:</Text>
                    <ClockDigit digit={months} type='Months' />
                    <Text style={styles.colon}>:</Text>
                    <ClockDigit digit={days} type='Days' />
                    <Text style={styles.colon}>:</Text>
                    <ClockDigit digit={hours} type='Hours' />
                </>
            ) : months > 0 ? (
                <>
                    <ClockDigit digit={months} type='Months' />
                    <Text style={styles.colon}>:</Text>
                    <ClockDigit digit={days} type='Days' />
                    <Text style={styles.colon}>:</Text>
                    <ClockDigit digit={hours} type='Hours' />
                    <Text style={styles.colon}>:</Text>
                    <ClockDigit digit={minutes} type='Minutes' />
                </>
            ) : (
                <>
                    <ClockDigit digit={days} type='Days' />
                    <Text style={styles.colon}>:</Text>
                    <ClockDigit digit={hours} type='Hours' />
                    <Text style={styles.colon}>:</Text>
                    <ClockDigit digit={minutes} type='Minutes' />
                    <Text style={styles.colon}>:</Text>
                    <ClockDigit digit={seconds} type='Seconds' />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        gap: scale(10),
        flexDirection: 'row',
        flexWrap: "wrap"
    },
    colon: {
        color: 'white',
        fontSize: scale(50),
    },
});

export default React.memo(CustomTimer);
