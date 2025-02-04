import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigation from './src/navigation/bottomTabNavigation';
import AddProduct from './src/screens/addProductScreen';
import HomeScreen from './src/screens/homeScreen';
import OrderHistoryScreen from './src/screens/orderHistoryScreen';
import { useState, useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from './src/utils/registerForPushNotificationsAsync';

// Set up the notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Stack = createStackNavigator();

const App = () => {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const [notification, setNotification] = useState<Notifications.Notification | undefined>();
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);
  const navigationRef = useRef<any>();
  const [isAppInitialized, setIsAppInitialized] = useState(false);

  useEffect(() => {
    // Register for push notifications
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token))
      .catch((error) => console.error('Error registering for push notifications:', error));

    // Listen for incoming notifications
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    // Listen for notification responses
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Notification Response:', response);
      if (navigationRef.current) {
        navigationRef.current.navigate("Order History")
      }
    });
    // const handleInitialNotification = async () => {
    //   const lastNotificationResponse = await Notifications.getLastNotificationResponseAsync();
    //   if (lastNotificationResponse) {
    //     console.log("Last Notification Response:", lastNotificationResponse)
    //     if (navigationRef.current) {
    //       navigationRef.current.navigate("Order History")
    //     }
    //   }
    // }
    // if (!isAppInitialized) {
    //   handleInitialNotification();
    //   setIsAppInitialized(true);
    // }
    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return (
    <Provider store={store}>
      <View style={styles.container}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Main" component={BottomTabNavigation} options={{ headerShown: false }} />
            <Stack.Screen name="AddProduct" component={AddProduct} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Order History" component={OrderHistoryScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </Provider>
  );
}
export default App;

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },
});
