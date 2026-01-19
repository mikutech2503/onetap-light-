import { Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { styles } from "./FlashlightButton.styles";

type Props = {
    torchOn: boolean;
    onToggle: () => void;
};

export function FlashlightButton({ torchOn, onToggle }: Props) {
    return (
        <View style={styles.container}>
            <Text style={[
                styles.title,
                { color: torchOn ? "#000" : "#FFF" },
            ]}>
                One - Tap Light
            </Text>

            <Pressable onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                onToggle();
            }}
                style={({ pressed }) => [
                    styles.button,
                    {
                        backgroundColor: torchOn ? "#FFF3B0" : "#222",
                        opacity: pressed ? 0.85 : 1,
                    },
                ]}>
                <Text style={[
                    styles.buttonText,
                    { color: torchOn ? "#000" : "#FFF" },
                ]}>
                    {torchOn ? "LIGHT ON" : "TAP TO TURN ON"}
                </Text>
            </Pressable>
        </View>
    );
}