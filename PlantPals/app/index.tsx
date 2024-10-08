import { Text, View, StyleSheet, Pressable } from "react-native";
import { router, Link } from 'expo-router';
import HomePlant from '@/assets/images/homeplant.svg'
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

export default function Index() {
  SplashScreen.preventAutoHideAsync();
  const [loaded, error] = useFonts({
    'Mooli-Regular': require('@/assets/fonts/Mooli-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }


  return (
    <View style={styles.background}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <HomePlant width={350} height={350} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.textStyle}>Track Your Plant!</Text>
          <Text style={styles.textStyleSmaller}>Step into a new world of botany!</Text>
        </View>
        <Pressable style={styles.buttonStyle} onPress={() => {
          router.push('/camera')
          // router.push("/api?token=gWkJd5BMXBtyDMc")
        }}>
          <Text style={styles.buttonText}>Add Your Plant</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#DFF6C2',
    width: "100%",
    height: "100%",

  },
  content: {
    marginLeft: 25,
    marginRight: 25,
    marginTop: 40,
    height: "100%",
    flexDirection: 'column',
  },
  imageContainer: {
    paddingTop: 100,
    alignSelf: 'center',
  },
  textContainer: {
    textAlign: 'center',
    alignItems: 'center',
  },
  textStyle: {
    paddingTop: 35,
    fontSize: 35,
    fontFamily: 'Mooli-Regular'
  },
  textStyleSmaller: {
    fontSize: 16,
    paddingTop: 40,
    paddingBottom: 35,
    fontFamily: 'Mooli-Regular'
  },
  buttonStyle: {
    margin: 40,
    borderRadius: 40,
    alignItems: 'center',
    backgroundColor: "#A1D65C"
  },
  buttonText: {
    fontSize: 20,
    padding: 25,
    fontFamily: 'Mooli-Regular'
  }
})