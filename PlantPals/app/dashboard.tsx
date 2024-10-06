import { Text, View, StyleSheet, Image } from 'react-native'
import React from 'react'
import { useState, useEffect, useRef } from 'react'
import * as Progress from 'react-native-progress'
import SunIcon from '@/assets/images/sunny.svg'
import WaterIcon from '@/assets/images/water.svg'
import TempIcon from '@/assets/images/temp.svg'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';


export default function Dashboard() {
    const [date, setDate] = useState('')
    const [drawerState, setDrawerState] = useState(false)
    const bottomSheetRef = useRef(null)
    const handleSheetChanges = (index: number) => {
        if (index == 1) {
            setDrawerState(true);

        } else {
            setDrawerState(false);

        }
    };
    useEffect(() => {
        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        var birthday = (date.toString()) + "/" + (month.toString()) + "/" + (year.toString());
        setDate(birthday);
    }, []);
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.bigText}>Frank Lin's Spawn</Text>
                <Text style={styles.medText}>Common Garden Weed</Text>
                <Text style={styles.captionText}>Birthday:{date}</Text>
                <Image style={styles.imageStyle} source={require('@/assets/images/placeholderplant.jpg')} />
                <View style={styles.barContainers}>
                    <View style={styles.barSection}>
                        <SunIcon width={40} height={40} />
                        <Progress.Bar style={styles.barStyle} progress={0.3} width={280} height={25} color={"#FFED4B"} borderRadius={10} borderWidth={0} unfilledColor='white' />
                    </View>
                    <View style={styles.barSection}>
                        <WaterIcon width={40} height={40} />
                        <Progress.Bar style={styles.barStyle} progress={0.8} width={280} height={25} color={"#68C0FF"} borderRadius={10} borderWidth={0} unfilledColor='white' />
                    </View>
                    <View style={styles.barSection}>
                        <TempIcon width={40} height={40} />
                        <Progress.Bar style={styles.barStyle} progress={0.5} width={280} height={25} color={"red"} borderRadius={10} borderWidth={0} unfilledColor='white' />
                    </View>
                </View>
            </View>
            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={['10%', '85%']}
                style={styles.bottomDrawer}
                onChange={handleSheetChanges}
            >
                <BottomSheetView style={styles.barContent}>
                    {!drawerState && <Text style={{ fontSize: 20 }}>more care info</Text>}
                    {drawerState &&
                        <View>
                            <Image style={styles.imageStyle} source={require('@/assets/images/placeholderplant.jpg')} />
                            <Text style={styles.medText}>Common Garden Weed</Text>
                            <Text> lorem ipsum lalalalaalla hehehehehe</Text>
                        </View>
                    }
                </BottomSheetView>
            </BottomSheet>
        </View >
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
        backgroundColor: 'red'
    },
    drawerMedText: {
        padding: 10,
        fontSize: 25,
        alignSelf: 'center'
    },
    paragraphText: {

    }
})