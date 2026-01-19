import { useEffect } from "react";
import { useCameraPermissions } from "expo-camera";

export function useCameraManager() {
    const [permission, requestPermission] = useCameraPermissions();

    useEffect(() => {
        // If permission status is undetermined (null), ask immediately
        if (permission && !permission.granted && permission.canAskAgain) {
            requestPermission();
        }
    }, [permission]);

    return {
        permission,
        requestPermission,
        isLoaded: !!permission,
        hasPermission: permission?.granted ?? false,
    };
}