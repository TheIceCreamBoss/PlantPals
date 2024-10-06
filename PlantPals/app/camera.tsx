import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';

export default function Camera() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef(null);
    const { uri } = useLocalSearchParams<{ uri?: string }>();

    if (!permission) {
        return <View/>;
    }

    if (!permission.granted) {
        return (
        <View style={styles.container}>
            <Text style={styles.message}>We need your permission to show the camera</Text>
            <Button onPress={requestPermission} title="grant permission" />
        </View>
        );
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    async function takePicture() {
        if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync();
        router.setParams({ uri: photo.uri });
        nextPage();
        }
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
    });
    if (!result.canceled) {
        router.setParams({ uri: result.assets[0].uri });
        nextPage();
    }
    };

    function nextPage() {
        router.push(`/api?uri=${uri}`);
    }

  return (
    <View style={styles.container}>
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
            <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.flip_button} onPress={toggleCameraFacing}>
                <Text style={styles.text}>Flip</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.picture_button} onPress={takePicture}>
                <Text style={styles.text}>Picture</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gallery_button} onPress={pickImage}>
                <Text style={styles.text}>Gallery</Text>
            </TouchableOpacity>
            </View>
        </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: "transparent",
        margin: 25,
    },
    flip_button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    picture_button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    gallery_button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
});
