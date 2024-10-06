import { useState, useEffect } from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import Arrow from '@/assets/images/arrow.svg'

export default function Camera() {
    const params = useLocalSearchParams<{token?: string, name?: string}>();
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
    } else if (response.result.classification.suggestions.length >= 3){
        return (
            <View style={styles.container}>
                <View style={styles.top_container}>
                    
                    <Text style={styles.main_text}>Select your species</Text>
                </View>
                <View style={styles.mid_container}>
                    <TouchableOpacity style={styles.result_container} onPress={()=>{
                        router.push(`/dashboard?token=${params.token}&name=${params.name}&plant=${response.result.classification.suggestions[0].name}`)
                    }}>
                        <View style={styles.result_img_box}>
                            <Image source={{uri: response.result.classification.suggestions[0].similar_images[0].url}} style={styles.result_img}/>
                        </View>
                        <View style={styles.result_text_box}>
                            <Text style={styles.result_text_title}>{response.result.classification.suggestions[0].name}</Text>
                            <Text style={styles.result_text_subtitle}>{(Math.round(Number(response.result.classification.suggestions[0].probability) * 1000) / 10).toString()}% similarity</Text>
                        </View>
                        <Arrow style={styles.arrow} height={108}/>
                    </TouchableOpacity>
                   <TouchableOpacity style={styles.result_container} onPress={()=>{
                        router.push(`/dashboard?token=${params.token}&name=${params.name}&plant=${response.result.classification.suggestions[1].name}`)
                    }}>
                        <View style={styles.result_img_box}>
                            <Image source={{uri: response.result.classification.suggestions[1].similar_images[0].url}} style={styles.result_img}/>
                        </View>
                        <View style={styles.result_text_box}>
                            <Text style={styles.result_text_title}>{response.result.classification.suggestions[1].name}</Text>
                            <Text style={styles.result_text_subtitle}>{(Math.round(Number(response.result.classification.suggestions[1].probability) * 1000) / 10).toString()}% similarity</Text>
                        </View>
                        <Arrow style={styles.arrow} height={108}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.result_container} onPress={()=>{
                        router.push(`/dashboard?token=${params.token}&name=${params.name}&plant=${response.result.classification.suggestions[2].name}`)
                    }}>
                        <View style={styles.result_img_box}>
                            <Image source={{uri: response.result.classification.suggestions[2].similar_images[0].url}} style={styles.result_img}/>
                        </View>
                        <View style={styles.result_text_box}>
                            <Text style={styles.result_text_title}>{response.result.classification.suggestions[2].name}</Text>
                            <Text style={styles.result_text_subtitle}>{(Math.round(Number(response.result.classification.suggestions[2].probability) * 1000) / 10).toString()}% similarity</Text>
                        </View>
                        <Arrow style={styles.arrow} height={108}/>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.not_here} onPress={()=>{
                        router.push("/camera")
                    }}>
                        <Text style={styles.not_here_text}>I don’t think my plant is shown above</Text>
                </TouchableOpacity>
            </View>
        );
    } else if (response.result.classification.suggestions.length >= 2){
        return (
            <View style={styles.container}>
                <View style={styles.top_container}>
                    
                    <Text style={styles.main_text}>Select your species</Text>
                </View>
                <View style={styles.mid_container}>
                    <TouchableOpacity style={styles.result_container} onPress={()=>{
                        router.push(`/dashboard?token=${params.token}&name=${params.name}&plant=${response.result.classification.suggestions[0].name}`)
                    }}>
                        <View style={styles.result_img_box}>
                            <Image source={{uri: response.result.classification.suggestions[0].similar_images[0].url}} style={styles.result_img}/>
                        </View>
                        <View style={styles.result_text_box}>
                            <Text style={styles.result_text_title}>{response.result.classification.suggestions[0].name}</Text>
                            <Text style={styles.result_text_subtitle}>{(Math.round(Number(response.result.classification.suggestions[0].probability) * 1000) / 10).toString()}% similarity</Text>
                        </View>
                        <Arrow style={styles.arrow} height={108}/>
                    </TouchableOpacity>
                   <TouchableOpacity style={styles.result_container} onPress={()=>{
                        router.push(`/dashboard?token=${params.token}&name=${params.name}&plant=${response.result.classification.suggestions[1].name}`)
                    }}>
                        <View style={styles.result_img_box}>
                            <Image source={{uri: response.result.classification.suggestions[1].similar_images[0].url}} style={styles.result_img}/>
                        </View>
                        <View style={styles.result_text_box}>
                            <Text style={styles.result_text_title}>{response.result.classification.suggestions[1].name}</Text>
                            <Text style={styles.result_text_subtitle}>{(Math.round(Number(response.result.classification.suggestions[1].probability) * 1000) / 10).toString()}% similarity</Text>
                        </View>
                        <Arrow style={styles.arrow} height={108}/>
                    </TouchableOpacity>
                    <View style={styles.result_container}>
                        <Text style={styles.no_sugg}>no other suggestions</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.not_here} onPress={()=>{
                        router.push("/camera")
                    }}>
                        <Text style={styles.not_here_text}>I don’t think my plant is shown above</Text>
                </TouchableOpacity>
            </View>
        );
    } else if (response.result.classification.suggestions.length >= 1){
        return (
            <View style={styles.container}>
                <View style={styles.top_container}>
                    
                    <Text style={styles.main_text}>Select your species</Text>
                </View>
                <View style={styles.mid_container}>
                    <TouchableOpacity style={styles.result_container} onPress={()=>{
                        router.push(`/dashboard?token=${params.token}&name=${params.name}&plant=${response.result.classification.suggestions[0].name}`)
                    }}>
                        <View style={styles.result_img_box}>
                            <Image source={{uri: response.result.classification.suggestions[0].similar_images[0].url}} style={styles.result_img}/>
                        </View>
                        <View style={styles.result_text_box}>
                            <Text style={styles.result_text_title}>{response.result.classification.suggestions[0].name}</Text>
                            <Text style={styles.result_text_subtitle}>{(Math.round(Number(response.result.classification.suggestions[0].probability) * 1000) / 10).toString()}% similarity</Text>
                        </View>
                        <Arrow style={styles.arrow} height={108}/>
                    </TouchableOpacity>
                   <View style={styles.result_container}>
                        <Text style={styles.no_sugg}>no other suggestions</Text>
                    </View>
                    <View style={styles.result_container}> 
                        <Text style={styles.no_sugg}>no other suggestions</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.not_here} onPress={()=>{
                        router.push("/camera")
                    }}>
                        <Text style={styles.not_here_text}>I don’t think my plant is shown above</Text>
                </TouchableOpacity>
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <Text>No Suggestions Found.</Text>
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
  },
  mid_container: {
    flex: 6,
    margin: 10,
    alignSelf: 'stretch',
    flexDirection: 'column',
  },
  main_text: {
    color: "#111111",
    textAlignVertical: "center",
    textAlign: "center",
    fontSize: 35,
    fontFamily: 'Mooli-Regular'
  },
  result_container: {
    borderRadius: 20,
    height: 100,
    flex: 1,
    backgroundColor: '#F2FFE2',
    flexDirection: 'row',
    margin: 10
  },
  result_img_box: {
    flex: 2
  },
  result_img: {
    width: 90,
    height: 90,
    borderRadius: 15,
    justifyContent: 'center',
    margin: 10
  },
  result_text_box: {
    flex: 5,
    fontFamily: 'Mooli-Regular',
    marginLeft: 20
  },
  result_text_title: {
    flex: 1.5,
    color: "#000000",
    textAlignVertical: "center",
    textAlign: "left",
    fontSize: 25,
    fontFamily: 'Mooli-Regular',
    marginTop: 10
  },
  result_text_subtitle: {
    flex: 1,
    color: "#4F4F4F",
    textAlignVertical: "center",
    textAlign: "left",
    fontSize: 15,
    fontFamily: 'Mooli-Regular',
    marginTop: -10

  },
  arrow: {
    alignContent: 'center',
    marginRight: 20
  },
  not_here: {
    flex: 3
  },
  not_here_text: {
    marginTop: 30,
    fontFamily: 'Mooli-Regular',
    textDecorationLine: "underline",
  },
  no_sugg: {
    fontFamily: 'Mooli-Regular',
    fontSize: 15,
    textAlign: 'center',
    textAlignVertical: 'center',
    flex: 1
  }
});
