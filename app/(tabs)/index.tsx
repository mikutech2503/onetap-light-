import { Text, View, Button, AppState, AppStateStatus } from "react-native";
import { useEffect, useState, useRef } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Brightness from "expo-brightness";

export default function Index() {
  const [permission, requestPermission] = useCameraPermissions();
  const [torchOn, setTorchOn] = useState(false);
  const originalBrightness = useRef<number | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Brightness.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Brightness permission not granted');
      }
    })();
  }, []);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  // Handle Torch & Brightness
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
      } else {
        // Restore brightness
        if (originalBrightness.current !== null) {
          await Brightness.setBrightnessAsync(originalBrightness.current);
          originalBrightness.current = null;
        }
      }
    };

    handleBrightness();
  }, [torchOn]);

  // Handle App Backgrounding
  useEffect(() => {
    const subscription = AppState.addEventListener("change", async (nextAppState) => {
      if (nextAppState.match(/inactive|background/)) {
        // App going directly to background/inactive: Restore brightness if allowed
        if (originalBrightness.current !== null) {
          await Brightness.setBrightnessAsync(originalBrightness.current);
          originalBrightness.current = null;
        }
        // Optional: Turn off torch state to match reality (iOS kills torch)
        setTorchOn(false);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Camera permission is required</Text>
        <Button title="Grant permission" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        style={{ flex: 1 }}
        enableTorch={torchOn}
      />

      <View
        style={{
          position: "absolute",
          bottom: 40,
          left: 0,
          right: 0,
          alignItems: "center",
        }}
      >
        <Button
          title={torchOn ? "Turn OFF Light" : "Turn ON Light"}
          onPress={() => setTorchOn((prev) => !prev)}
        />
      </View>
    </View>
  );
}
