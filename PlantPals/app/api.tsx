import { useState, useEffect } from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

export default function Camera() {
    const params = useLocalSearchParams<{token?: string}>();
    const [response, setResponse] = useState<any>(null); // State to store the API response
    const [loading, setLoading] = useState(true); // State to manage loading

    SplashScreen.preventAutoHideAsync();
    const [loaded, error] = useFonts({
        'Mooli-Regular': require('@/assets/fonts/Mooli-Regular.ttf'),
    });
    useEffect(() => {
        getInfo(); // Fetch data on component mount
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, []);

    if (!loaded && !error) {
        return null;
    }

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
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    }

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!response || !response.input || !response.input.images || !response.input.images[0]) {
        return (
            <View style={styles.container}>
                <Text>No Image Found.</Text>
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <View style={styles.top_container}>
                    <Image source={{uri: response.input.images[0]}} style={styles.tinyLogo} />
                    <Text style={styles.main_text}>{(Math.round(Number(response.result.is_plant.probability) * 1000) / 10).toString()}% Plant</Text>
                </View>
                <View style={styles.bot_container}>
                    <TouchableOpacity style={styles.result_container} onPress={()=>{
                        router.push("")
                    }}>
                        <Text style={styles.prediction_text}>{(Math.round(Number(response.result.classification.suggestions[0].probability) * 1000) / 10).toString()}%</Text>
                        <Image source={{uri: response.result.classification.suggestions[0].similar_images[0].url}} style={styles.prob_img}/>
                        <Text style={styles.prob_text}>{response.result.classification.suggestions[0].name}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.result_container} onPress={()=>{
                        router.push("")
                    }}>
                        <Text style={styles.prediction_text}>{(Math.round(Number(response.result.classification.suggestions[1].probability) * 1000) / 10).toString()}%</Text>
                        <Image source={{uri: response.result.classification.suggestions[1].similar_images[0].url}} style={styles.prob_img}/>
                        <Text style={styles.prob_text}>{response.result.classification.suggestions[1].name}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.result_container} onPress={()=>{
                        router.push("")
                    }}>
                        <Text style={styles.prediction_text}>{(Math.round(Number(response.result.classification.suggestions[2].probability) * 1000) / 10).toString()}%</Text>
                        <Image source={{uri: response.result.classification.suggestions[2].similar_images[0].url}} style={styles.prob_img}/>
                        <Text style={styles.prob_text}>{response.result.classification.suggestions[2].name}</Text>
                    </TouchableOpacity>
                    <Pressable style={styles.buttonStyle} onPress={()=>{
                    // router.push('/camera')
                    router.push("/api?token=FdTMsbUKfMvfO4Y")
                    }}>
                    <Text style={styles.buttonText}>None of the Above</Text>
                    </Pressable>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#DFF6C2'
  },
  top_container: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignSelf: 'stretch',
    margin: 10,
    alignItems: 'center',
    backgroundColor: 'red',
    borderRadius: 30,
  },
  bot_container: {
    flex: 6,
    margin: 10,
    alignSelf: 'stretch',
    flexDirection: 'column',
  },
  tinyLogo: {
    flex: 4,
    width: 150,
    height: 150,
    borderRadius: 20,
    margin: 10
  },
  prob_text: {
    flex: 1.5,
    color: "#111111",
    textAlignVertical: "center",
    textAlign: "center",
    fontWeight: 'bold',
    fontSize: 20
  },
  prediction_text: {
    flex: 1,
    color: "#111111",
    textAlignVertical: "center",
    textAlign: "center",
    fontWeight: 'bold',
    fontSize: 20
  },
  main_text: {
    flex: 5,
    color: "#111111",
    textAlignVertical: "center",
    textAlign: "center",
    fontWeight: 'bold',
    fontSize: 30,
  },
  result_container: {
    borderRadius: 30,
    borderColor: "#AFC692",
    flex: 1,
    margin: 10,
    marginTop: 15,
    backgroundColor: '#BFD6A2',
    flexDirection: 'row',
    borderWidth: 2
  },
  prob_img: {
    width: 90,
    height: 90,
    borderRadius: 15,
    justifyContent: 'center',
    margin: 2
  },
  buttonStyle:{
    margin:40,
    borderRadius:40,
    alignItems:'center',
    backgroundColor:"#A1D65C"
  },
  buttonText:{
    fontSize:20,
    padding:25
  }

});
