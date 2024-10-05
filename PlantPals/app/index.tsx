import { Text, View } from "react-native";
import { Link } from 'expo-router';

export default function Index() {
  return (
    <View>
      <Text>hhh
      </Text>
      <Link href="/camera">Camera</Link>
    </View>
  );
}