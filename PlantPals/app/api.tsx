import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

export default function Camera() {
    const params = useLocalSearchParams<{uri?: string}>();
    console.log(params.uri);

    async function createIdentification() {
    try {
        let response = await fetch(
        `https://plant.id/api/v3/identification${process.env.API_KEY}`,
        );
        let responseJson = await response.json();
        console.log(responseJson);
        return responseJson;
    } catch (error) {
        console.error(error);
    }
    }

    return (
        <View style={styles.container}>
            <Image style={styles.tinyLogo} source={{uri: params.uri}}/>
        </View>
    ) ;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    margin: 25,
    backgroundColor: "red"
  },
  tinyLogo: {
    width: 50,
    height: 50,
  }

});
