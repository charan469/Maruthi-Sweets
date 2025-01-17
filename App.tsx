import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Header from './src/components/header';
import HomeScreen from './src/screens/homeScreen';
import OrderHistoryScreen from './src/screens/orderHistoryScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import CartScreen from './src/screens/cartScreen';

const Tab = createBottomTabNavigator();

// Main App Component
export default function App() {
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <NavigationContainer>
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

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },
});
