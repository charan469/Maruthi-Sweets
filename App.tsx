import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Header from './src/components/header';
import HomeScreen from './src/screens/homeScreen';
import OrderHistoryScreen from './src/screens/orderHistoryScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import CartScreen from './src/screens/cartScreen';
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
const Tab = createBottomTabNavigator();
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
        <NavigationContainer ref={navigationRef}>
          <Header />
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false, // Hides the default tab bar header
              tabBarStyle: { backgroundColor: '#fff' },
              tabBarActiveTintColor: '#000', // Active tab color
              tabBarInactiveTintColor: 'gray', // Inactive tab color
              tabBarIcon: ({ focused, color, size }) => {
                let iconName: string = '';

                // Set icons for each tab
                if (route.name === 'Home') {
                  iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'Order History') {
                  iconName = focused ? 'list' : 'list-outline';
                }

                // Return the icon component
                return <Ionicons name={iconName} size={size} color={color} />;
              },
            })
            }
          >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen
              name="Cart"
              component={CartScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="cart-outline" color={color} size={size} />
                ),
              }}
            />
            <Tab.Screen name="Order History" component={OrderHistoryScreen} />
          </Tab.Navigator>
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
