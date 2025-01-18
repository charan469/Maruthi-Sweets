import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

const Header: React.FC = () => {
    const cart = useSelector((state: any) => state.cart.cart);
    const navigation = useNavigation<any>();
    // Calculate total items in the cart
    const totalItems = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);

    return (
        <View style={styles.header}>
            <Image source={require('../../assets/hanuman-logo.png')} style={styles.headerLogo} resizeMode='contain' />
            <Text style={styles.headerTitle}>Sri Maruthi Sweets</Text>
            <TouchableOpacity style={styles.cartContainer} onPress={() =>  navigation.navigate("Cart")}>
                <Ionicons name="cart-outline" size={28} color="#000" />
                {totalItems > 0 && (
                    <View style={styles.cartBadge}>
                        <Text style={styles.cartBadgeText}>{totalItems}</Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 10,
        paddingTop: 30,
        backgroundColor: '#fff',
        borderBottomWidth: 0.6,
        borderBottomColor: 'grey'
    },
    headerLogo: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    cartContainer: {
        position: "relative",
        marginLeft:'auto'
    },
    cartBadge: {
        position: "absolute",
        right: -5,
        top: -5,
        backgroundColor: "red",
        borderRadius: 10,
        paddingHorizontal: 5,
        height: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    cartBadgeText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
    },
});

export default Header;