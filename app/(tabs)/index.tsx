import { Text, View, Pressable, Button } from "react-native";
import { CameraView } from "expo-camera";
import { useFlashlight } from "../../hooks/use-flashlight";
import { useCameraManager } from "../../hooks/use-camera-manager";
import { styles } from "./styles";
import { FlashlightButton } from "../../components/FlashlightButton";


export default function Index() {
  const { permission, requestPermission, isLoaded, hasPermission } = useCameraManager();
  const { torchOn, setTorchOn } = useFlashlight();

  // 1. Wait for permissions to load
  if (!isLoaded) return <View style={styles.container} />;

  // 2. Handle denied permissions
  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Camera permission is required</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }
  return (
    <View style={{
      flex: 1,
      backgroundColor: torchOn ? "#FDF6E3" : "#000",
    }}
    >
      <CameraView
        style={{ flex: 1 }}
        enableTorch={torchOn}
      />
      <FlashlightButton
        torchOn={torchOn}
        onToggle={() => setTorchOn((prev) => !prev)}
      />

    </View>
  );
}
