import { Text, View, StyleSheet, Image, Pressable } from 'react-native'
import React from 'react'
import { useState, useEffect, useRef } from 'react'
import * as Progress from 'react-native-progress'
import SunIcon from '@/assets/images/sunny.svg'
import WaterIcon from '@/assets/images/water.svg'
import TempIcon from '@/assets/images/temp.svg'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useFonts } from 'expo-font';
import { useLocalSearchParams } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

const PressableBubble = ({ icon, value }) => {
    return (
        <Pressable style={styles.dataBubble}>
            {icon}
            <Text style={{ marginTop: 5 }}>{value}</Text>
        </Pressable>
    )
}



export default function Dashboard() {
    const params = useLocalSearchParams<{ token?: string, plant?: string, name?: string }>();
    const [response, setResponse] = useState<any>(null); // State to store the API response
    const [date, setDate] = useState('')
    const bottomSheetRef = useRef(null)
    const [piValues, setPiValues] = useState({});

    SplashScreen.preventAutoHideAsync();
    const [loaded, error] = useFonts({
        'Mooli-Regular': require('@/assets/fonts/Mooli-Regular.ttf'),
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);



    useEffect(() => {
        async function getPiData() {
            const url = "http://192.168.125.40:4000/get";

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const json = await response.json();
            setPiValues(json)
            return json
        };

        async function getInfo() {
            try {
                let res = await fetch(`https://plant.id/api/v3/identification/${params.token}`, {
                    method: 'GET',
                    headers: {
                        'Api-Key': process.env.EXPO_PUBLIC_API_KEY,
                        'Content-Type': 'application/json',
                    }
                });
                const jsonResponse = await res.json(); // Parse response as JSON
                setResponse(jsonResponse); // Save response to state
            } catch (error) {
                console.error(error);
            }
        }

        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        var birthday = (date.toString()) + "/" + (month.toString()) + "/" + (year.toString());
        setDate(birthday);
        getPiData();
        getInfo();
    }, []);
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.bigText}>{params.name}</Text>
                <Text style={styles.medText}>{params.plant}</Text>
                <Text style={styles.captionText}>Birthday: {date}</Text>
                {response && <Image style={styles.imageStyle} source={{ uri: response.input.images[0] }} />}
                <View style={styles.barContainers}>
                    <View style={styles.barSection}>
                        <SunIcon width={40} height={40} />
                        <Progress.Bar style={styles.barStyle} progress={0.3} width={280} height={25} color={"#FFED4B"} borderRadius={10} borderWidth={0} unfilledColor='white' />
                        <Text>{piValues.lux}</Text>
                    </View>
                    <View style={styles.barSection}>
                        <WaterIcon width={40} height={40} />
                        <Progress.Bar style={styles.barStyle} progress={0.8} width={280} height={25} color={"#68C0FF"} borderRadius={10} borderWidth={0} unfilledColor='white' />
                        <Text>{piValues.soil_moisture}</Text>
                    </View>
                    <View style={styles.barSection}>
                        <TempIcon width={40} height={40} />
                        <Progress.Bar style={styles.barStyle} progress={0.5} width={280} height={25} color={"red"} borderRadius={10} borderWidth={0} unfilledColor='white' />
                        <Text>{piValues.temperature}</Text>
                    </View>
                </View>
            </View>
            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={['10%', '85%']}
                style={styles.bottomDrawer}
                backgroundStyle={{ borderRadius: 50 }}
            >
                <BottomSheetView style={styles.barContent}>

                    <Text style={{ fontSize: 20, alignSelf: 'center', marginTop: 15 }}>more care info</Text>
                    <View>
                        {response && <Image style={styles.imageStyle} source={{ uri: response.input.images[0] }} />}
                        <Text style={styles.medText}>{params.token}</Text>
                        <Text style={styles.paragraphText}> lorem ipsum lalalalaalla hehehehehe</Text>

                        <Text style={{ fontSize: 25 }}>Data</Text>
                        <View style={styles.dataBubbles}>
                            <PressableBubble icon={<SunIcon width={30} height={30} />} value="Bright" />

                            <PressableBubble icon={<WaterIcon width={30} height={30} />} value="Moist" />
                        </View>
                        <View style={styles.dataBubbles}>
                            <PressableBubble icon={<TempIcon width={30} height={30} />} value="Warm" />
                            <PressableBubble icon={<TempIcon width={30} height={30} />} value="Warm" />

                        </View>
                    </View>
                </BottomSheetView>
            </BottomSheet>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#DFF6C2',
        width: "100%",
        height: "100%",
    },
    content: {
        paddingTop: 80,
        marginTop: 40,
        marginLeft: 25,
        marginRight: 25
    },
    bigText: {
        fontSize: 30,
        alignSelf: 'center'
    },
    medText: {
        padding: 10,
        fontSize: 20,
        alignSelf: 'center'
    },
    captionText: {
        fontSize: 20,
        alignSelf: 'center',
        color: "#7A7A7A"
    },
    imageStyle: {
        marginTop: 25,
        width: 265,
        height: 265,
        alignSelf: 'center',
        borderRadius: 20
    },
    barStyle: {
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 2
    },
    barContainers: {
        paddingTop: 20
    },
    barSection: {
        padding: 15,
        flexDirection: 'row'
    },
    bottomDrawer: {
        width: "100%"
    },
    barContent: {
        width: '80%',
        alignSelf: 'center',
    },
    drawerMedText: {
        padding: 10,
        fontSize: 25,
        alignSelf: 'center'
    },
    paragraphText: {
        margin: 20,
        marginBottom: 100,
        fontSize: 15
    },
    dataBubbles: {
        flexDirection: "row",
        width: "100%",
        paddingTop: 10
    },
    dataBubble: {
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 50,
        paddingRight: 50,
        borderRadius: 20,
        marginRight: 10,
        borderColor: "lightgray",
        borderWidth: 2
    }
})