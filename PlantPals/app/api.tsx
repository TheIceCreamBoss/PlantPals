import { useState, useEffect } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { TextInput } from 'react-native-gesture-handler';

export default function Camera() {
  const params = useLocalSearchParams<{ token?: string }>();
  const [response, setResponse] = useState<any>(null); // State to store the API response
  const [loading, setLoading] = useState(true); // State to manage loading
  const [plantName, setPlantName] = useState(''); // State for TextInput

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
      let res = await fetch(
        `https://plant.id/api/v3/identification/${params.token}`,
        {
          method: 'GET',
          headers: {
            'Api-Key': process.env.EXPO_PUBLIC_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );
      const jsonResponse = await res.json(); // Parse response as JSON
      setResponse(jsonResponse); // Save response to state
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  function handleSubmit() {
    // Handle the submission of plantName
    console.log('Submitted plant name:', plantName);
    // Perform necessary action, e.g., send to API or navigate
    router.push(`/pickplant?token=${params.token}&name=${encodeURIComponent(plantName)}`);
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (
    !response ||
    !response.input ||
    !response.input.images ||
    !response.input.images[0]
  ) {
    return (
      <View style={styles.container}>
        <Text>No Image Found.</Text>
      </View>
    );
  } else {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.container}>
              <View style={styles.top_container}>
                <Text style={styles.page_title}>Name your plant</Text>
                <Text style={styles.main_text}>
                  Your photo is{' '}
                  {(
                    Math.round(
                      Number(response.result.is_plant.probability) * 1000
                    ) / 10
                  ).toString()}
                  % a plant!
                </Text>
                <View style={styles.tinyLogo_background}>
                  <Image
                    source={{ uri: response.input.images[0] }}
                    style={styles.tinyLogo}
                  />
                </View>
              </View>
              <View style={styles.bot_container}>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.prediction_text}
                    placeholder="Enter plant name here"
                    value={plantName}
                    onChangeText={setPlantName}
                    onSubmitEditing={handleSubmit}
                  />
                </View>
                <Pressable style={styles.buttonStyle} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Select your species</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DFF6C2',
  },
  page_title: {
    fontSize: 35,
    marginTop: 20,
    fontFamily: 'Mooli-Regular'
  },
  top_container: {
    flexGrow: 0.5,
    alignItems: 'center',
    borderRadius: 30,
    margin: 10,
    padding: 10,
    justifyContent: 'center',
  },
  bot_container: {
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 5,
    justifyContent: 'center',
  },
  tinyLogo_background: {
    backgroundColor: '#F2FFE2',
    borderRadius: 20,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 3 / 4,
    overflow: 'hidden',
    width: '90%',
  },
  tinyLogo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 20,
  },
  inputContainer: {
    width: '80%',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 10,
  },
  prediction_text: {
    color: '#000000',
    textAlign: 'center',
    fontSize: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    fontFamily: 'Mooli-Regular'
  },
  main_text: {
    color: '#111111',
    textAlign: 'center',
    fontSize: 15,
    paddingTop: 10,
    bottom: 5,
    fontFamily: 'Mooli-Regular'
  },
  buttonStyle: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#A1D65C',
  },
  buttonText: {
    fontSize: 25,
    color: '#000000',
    fontFamily: 'Mooli-Regular'
  },
});