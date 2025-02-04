import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Header from '../components/header';
import HomeScreen from '../screens/homeScreen';
import OrderHistoryScreen from '../screens/orderHistoryScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';


const Tab = createBottomTabNavigator();
const BottomTabNavigation = () => {

    return (
        <View style={styles.container}>
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
                <Tab.Screen name="Order History" component={OrderHistoryScreen} />
            </Tab.Navigator>
        </View>

    );
}
export default BottomTabNavigation;

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },
});
