import { useState, useEffect, useRef } from "react";
import { AppState } from "react-native";
import * as Brightness from "expo-brightness";

export function useFlashlight() {
    const [torchOn, setTorchOn] = useState(false);
    const originalBrightness = useRef<number | null>(null);

    // Initial Permission Request
    useEffect(() => {
        Brightness.requestPermissionsAsync();
    }, []);

    // Handle Torch & Brightness logic
    useEffect(() => {
        const handleBrightness = async () => {
            if (torchOn) {
                // Save current brightness and set to max
                const current = await Brightness.getBrightnessAsync();
                // Only save if we haven't already (prevents overwriting with 1.0 if rapid toggles)
                if (originalBrightness.current === null) {
                    originalBrightness.current = current;
                }
                await Brightness.setBrightnessAsync(1.0);
            } else if (originalBrightness.current !== null) {
                // Restore original brightness
                await Brightness.setBrightnessAsync(originalBrightness.current);
                originalBrightness.current = null;
            }
        };
        handleBrightness();
    }, [torchOn]);

    // Cleanup on Background
    useEffect(() => {
        const subscription = AppState.addEventListener("change", async (nextAppState) => {
            if (nextAppState.match(/inactive|background/)) {
                if (originalBrightness.current !== null) {
                    await Brightness.setBrightnessAsync(originalBrightness.current);
                    originalBrightness.current = null;
                }
                setTorchOn(false);
            }
        });
        return () => subscription.remove();
    }, []);

    return { torchOn, setTorchOn };
}