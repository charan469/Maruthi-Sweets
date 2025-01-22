import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Alert } from 'react-native';

export function handleRegistrationError(errorMessage: string) {
    alert(errorMessage);
    throw new Error(errorMessage);
  }

const serverUrl = 'http://localhost:5000';
// Function to register for push notifications
export async function registerForPushNotificationsAsync(): Promise<string | undefined> {
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert('Permission Required', 'Enable notifications in settings to receive push notifications.');
      return;
    }

    const projectId = Constants.expoConfig?.extra?.eas?.projectId || Constants.easConfig?.projectId;

    if (!projectId) {
      console.error('Error: Missing project ID in Expo configuration.');
      return;
    }

    try {
      const { data } = await Notifications.getExpoPushTokenAsync({ projectId });
      console.log('Expo Push Token:', data);

      // Send token to backend
      await fetch(`${serverUrl}/api/save-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fcmToken: data }),
      });

      return data;
    } catch (error) {
      console.error('Error fetching Expo push token:', error);
    }
  } else {
    Alert.alert('Physical Device Required', 'Push notifications require a physical device.');
  }
}


// Function to send a test push notification
export async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Test Notification',
    body: 'This is a test notification sent from the app!',
    data: { extraData: 'Some extra data' },
  };

  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    const result = await response.json();
    console.log('Push Notification Sent:', result);
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
}