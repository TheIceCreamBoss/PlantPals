import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';


export default function Camera() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef(null);

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
            const photo = await cameraRef.current.takePictureAsync({
                allowsEditing: true,
                quality: 1,
                base64: true
            });
            queryAPI(photo.base64);
        }
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
        base64: true
    });
    if (!result.canceled && result.assets[0].base64) {
        queryAPI(result.assets[0].base64);
    }
    };

    async function queryAPI(base64: string) {
        try {
            let res = await fetch('https://plant.id/api/v3/identification', {
                method: 'POST',
                headers: {
                'Api-Key': process.env.EXPO_PUBLIC_API_KEY,
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                images: [`data:image/jpg;base64,${base64}`],
                latitude: 49.277,
                longitude: -122.909,
                similar_images: true,
                }),
            });
            const jsonResponse = await res.json();
            if (jsonResponse.access_token) {
                router.setParams({ token: jsonResponse.access_token });
                router.push(`/api?token=${jsonResponse.access_token}`);
            } else {
                console.error("access_token not found in the response.");
            }
        } catch (error) {
            console.error(error);
        }
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
