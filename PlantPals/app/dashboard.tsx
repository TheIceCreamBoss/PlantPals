import { Text, View, StyleSheet, Image, Pressable } from 'react-native'
import React from 'react'
import { useState, useEffect, useRef } from 'react'
import * as Progress from 'react-native-progress'
import SunIcon from '@/assets/images/sunny.svg'
import WaterIcon from '@/assets/images/water.svg'
import TempIcon from '@/assets/images/temp.svg'
import DiffIcon from '@/assets/images/plant-svgrepo-com.svg'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useFonts } from 'expo-font';
import { useLocalSearchParams } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

const PressableBubble = ({ icon, value }) => {
    return (
        <Pressable style={styles.dataBubble}>
            {icon}
            <Text style={{ marginTop: 5, fontFamily: "Mooli-Regular" }}>{value}</Text>
        </Pressable>
    )
}


const normalizeValue = (value, minValue, maxValue) => {
    return (value - minValue) / (maxValue - minValue);
};

const getSunlight = (num: number) => {
    if (num === 1) {
        return " None ";
    } else if (num === 2) {
        return " Indirect ";
    } else {
        return " Full "
    }
};

const getMoist = (num: number) => {
    if (num === 1) {
        return " 1/5 ";
    } else if (num === 2) {
        return " 2/5 ";
    } else if (num === 3) {
        return " 3/5 ";
    } else if (num === 4) {
        return " 4/5 ";
    } else {
        return " 5/5 "
    }
};

const getDifficulty = (num: number) => {
    if (num === 1) {
        return "Easy";
    } else if (num === 2) {
        return "Medium";
    } else {
        return "Hard"
    }
};
const normalizeValue2 = (value, maxValue) => {
    return Math.abs((value - -4095) / (-(maxValue) - -4095))
};
export default function Dashboard() {
    const params = useLocalSearchParams<{ token?: string, plant?: string, name?: string }>();
    const [response, setResponse] = useState<any>(null); // State to store the API response
    const [chatResponse, setChatResponse] = useState<any>({}); // State to store the API response
    const [date, setDate] = useState('')
    const bottomSheetRef = useRef(null)
    const [piValues, setPiValues] = useState({});
    const [barValues, setBarValues] = useState({})
    const [isLoading, setLoading] = useState(true)



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
        const interval = setInterval(async () => {
            const result = await getPiData();
            setPiValues({ lux: result.lux, temperature: result.temperature, soil_moisture: (-1 * result.soil_moisture) })
            if (piValues.lux || piValues.temperature || piValues.soil_moisture) {
                let maxLuxValue = 15000
                let minLuxValue = 5000
                if (chatResponse.sunlight == 2) {
                    maxLuxValue = 5000
                    minLuxValue = 800
                } else if (chatResponse.sunlight == 1) {
                    maxLuxValue = 800
                    minLuxValue = 200
                }
                let maxMoist = 501
                if (chatResponse.water == 4) {
                    maxMoist = 1000
                } else if (chatResponse.water == 3) {
                    maxMoist = 2000
                } else if (chatResponse.water == 2) {
                    maxMoist = 1095
                } else if (chatResponse.water == 1) {
                    maxMoist = 3800
                }
                const luxN = normalizeValue(piValues.lux, minLuxValue, maxLuxValue);
                const tempN = normalizeValue(piValues.temperature, 15, 30);
                const waterN = normalizeValue2(piValues.soil_moisture, 1700);
                setBarValues({ lux: luxN, soil_moisture: waterN, temperature: tempN });
            }
        }, 1500);
        return () => clearInterval(interval);
    }, [piValues]);

    function extractJsonFromString(inputString: string) {
        // Regular expression to match content within triple backticks
        const pattern = /```(.*?)```/s;
        console.log(inputString);

        // Search for the pattern in the input string
        const match = inputString.match(pattern);

        if (match) {
            let jsonString = match[1].trim(); // Extract the JSON part and remove any extra whitespace

            if (jsonString.startsWith("json")) {
                jsonString = jsonString.substring(4).trim();
            }
            console.log(jsonString);
            try {
                // Parse and return the JSON data
                return JSON.parse(jsonString);
            } catch (error) {
                throw new Error("Invalid JSON format.");
            }
        } else {
            throw new Error("No JSON found between triple backticks.");
        }
    }

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

    async function getChatInfo() {
        try {
            let res = await fetch(`https://plant.id/api/v3/identification/${params.token}/conversation`, {
                method: 'POST',
                headers: {
                    'Api-Key': process.env.EXPO_PUBLIC_API_KEY,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question: `For the plant ${params.plant}, give me: \n
                            sunlight: recommended sunlight range from 1 to 3, where 1 is no sunlight, 2 is indirect sunlight, and 3 is high sunlight, \n
                            water: recommended water range from 1 to 5, where 1 is low amounts of water required and 5 is high amount of water required, \n
                            temperature: recommended temperature range in celsius, add °C at the end, make sure that the format of the string is "{lowerValue}-{higherValue}°C" \n
                            difficulty: difficulty to take of the plant in the range from 1 to 3, \n
                            description: a short text description max 200 characters of the plant`,
                    prompt: "Give data in json form, for the 5 parameters: sunlight, water, temperature, difficulty, description",
                    temperature: 0.1,
                }),
            });
            try {
                console.log(res)
                const jsonResponse = await res.json(); // Parse response as JSON

                console.log(jsonResponse.messages[jsonResponse.messages.length - 1].content);
                setChatResponse(extractJsonFromString(jsonResponse.messages[jsonResponse.messages.length - 1].content)); // Save response to state
                console.log(chatResponse.description);
            } catch (err) {
                console.log(err);
            }
        } catch (error) {
            console.error(error);
        }
    }

    //console.log(chatResponse);

    useEffect(() => {
        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        var birthday = (date.toString()) + "/" + (month.toString()) + "/" + (year.toString());
        setDate(birthday);
        const result = getPiData();
        setPiValues({ lux: result.lux, temperature: result.temperature, soil_moisture: result.soil_moisutre })
        getInfo();
        getChatInfo();
        setLoading(false);
    }, []);

    if (isLoading) {
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text>Loading...</Text>

                </View>
            </View>
        )
    } else {
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
                            <Progress.Bar style={styles.barStyle} progress={barValues.lux} width={280} height={25} color={"#FFED4B"} borderRadius={10} borderWidth={0} unfilledColor='white' />
                        </View>
                        <View style={styles.barSection}>
                            <WaterIcon width={40} height={40} />
                            <Progress.Bar style={styles.barStyle} progress={barValues.soil_moisture} width={280} height={25} color={"#68C0FF"} borderRadius={10} borderWidth={0} unfilledColor='white' />
                        </View>
                        <View style={styles.barSection}>
                            <TempIcon width={40} height={40} />
                            <Progress.Bar style={styles.barStyle} progress={barValues.temperature} width={280} height={25} color={"red"} borderRadius={10} borderWidth={0} unfilledColor='white' />
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

                        <Text style={{ fontSize: 20, alignSelf: 'center', marginTop: 15, fontFamily: "Mooli-Regular" }}>more care info</Text>
                        <View>
                            {response && <Image style={styles.imageStyle} source={{ uri: response.input.images[0] }} />}
                            <Text style={styles.medText}>{params.plant}</Text>
                            <Text style={styles.paragraphText}>{chatResponse.description}</Text>

                            <Text style={{ fontSize: 25 }}>Data</Text>
                            <View style={styles.dataBubbles}>
                                <PressableBubble icon={<SunIcon width={30} height={30} />} value={getSunlight(chatResponse.sunlight)} />

                                <PressableBubble icon={<WaterIcon width={30} height={30} />} value={getMoist(chatResponse.water)} />
                            </View>
                            <View style={styles.dataBubbles}>
                                <PressableBubble icon={<TempIcon width={30} height={30} />} value={chatResponse.temperature} />
                                <PressableBubble icon={<DiffIcon width={30} height={30} />} value={getDifficulty(chatResponse.difficulty)} />

                            </View>
                        </View>
                    </BottomSheetView>
                </BottomSheet>
            </View>
        )
    }
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
        alignSelf: 'center',
        fontFamily: 'Mooli-Regular'
    },
    medText: {
        padding: 10,
        fontSize: 20,
        alignSelf: 'center',
        fontFamily: "Mooli-Regular"

    },
    captionText: {
        fontSize: 20,
        alignSelf: 'center',
        color: "#7A7A7A",
        fontFamily: "Mooli-Regular"
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
        marginBottom: 20,
        fontSize: 15,
        fontFamily: "Mooli-Regular"
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
        paddingLeft: 37,
        paddingRight: 37,
        borderRadius: 20,
        marginRight: 10,
        borderColor: "lightgray",
        borderWidth: 2
    }
})