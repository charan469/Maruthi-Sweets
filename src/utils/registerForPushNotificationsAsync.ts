import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Alert } from "react-native";
import { API_BASE_URL, NOTIFICATION_URL } from "@env";

export function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

// Function to register for push notifications and save token
export async function registerForPushNotificationsAsync(): Promise<
  string | undefined
> {
  if (!Device.isDevice) {
    Alert.alert(
      "Physical Device Required",
      "Push notifications require a physical device."
    );
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    Alert.alert(
      "Permission Required",
      "Enable notifications in settings to receive push notifications."
    );
    return;
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ||
    Constants.easConfig?.projectId;

  if (!projectId) {
    console.error("Error: Missing project ID in Expo configuration.");
    return;
  }

  try {
    const { data: fcmToken } = await Notifications.getExpoPushTokenAsync({
      projectId,
    });
    console.log("Expo Push Token:", fcmToken);

    // Save FCM token to backend
    await saveSellerFcmToken(fcmToken);

    return fcmToken;
  } catch (error) {
    console.error("Error fetching Expo push token:", error);
  }
}

// Function to save the seller FCM token to the database
async function saveSellerFcmToken(fcmToken: string) {
  try {
    const response = await fetch(`${API_BASE_URL}save-seller-fcm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fcmToken }),
    });

    const result = await response.json();
    console.log("Seller FCM Token Response:", result);
  } catch (error) {
    console.error("Error saving seller FCM token:", error);
  }
}

// Function to send a test push notification
export async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Test Notification",
    body: "This is a test notification sent from the app!",
    data: { extraData: "Some extra data" },
  };

  try {
    const response = await fetch(`${NOTIFICATION_URL}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    const result = await response.json();
    console.log("Push Notification Sent:", result);
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
}
