import { Text, View } from "react-native";
import { styles } from "./styles";

export default function ProfileHeader(){
    return (
        <View style={styles.header}>
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>Y</Text>
            </View>
            <Text style={styles.name}>Your study profile</Text>
            <Text style={styles.subtitle}>All your stats in one place</Text>
        </View>
    )
}