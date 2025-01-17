import React from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart, updateItemQuantity, removeItemFromCart } from '../redux/actions/cartActions'; // Import remove action

interface CardProps {
    item: {
        name: string;
        price: number;
        description: string;
        image: string;
    };
}

const Card: React.FC<CardProps> = ({ item }) => {
    const dispatch = useDispatch();
    const cart = useSelector((state: any) => state.cart.cart);

    // Find the item in the cart
    const cartItem = cart.find((cartItem: any) => cartItem.name === item.name);

    const handleAddItem = () => {
        dispatch(addItemToCart(item)); // Add item to the cart with quantity 1
    };

    const handleIncreaseQuantity = () => {
        if (cartItem) {
            dispatch(updateItemQuantity(cartItem, cartItem.quantity + 1)); // Increase quantity
        }
    };

    const handleDecreaseQuantity = () => {
        if (cartItem && cartItem.quantity === 1) {
            dispatch(removeItemFromCart(cartItem.name)); // Remove item from cart when quantity is 1
        } else if (cartItem && cartItem.quantity > 1) {
            dispatch(updateItemQuantity(cartItem, cartItem.quantity - 1)); // Decrease quantity
        }
    };

    return (
        <View style={styles.card}>
            <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <Text style={styles.itemPrice}>Rs{item.price}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
            </View>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Image
                    source={item.image}
                    style={{ width: 100, height: 100, borderRadius: 10 }}
                    resizeMode="contain"
                />
                {cartItem && cartItem.quantity > 0 ? (
                    // If the item is in the cart and has quantity > 0, show quantity controls
                    <View style={styles.quantityControls}>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={handleDecreaseQuantity}
                        >
                            <Text style={styles.quantityText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantityValue}>{cartItem.quantity}</Text>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={handleIncreaseQuantity}
                        >
                            <Text style={styles.quantityText}>+</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    // If the item is not in the cart, show "ADD" button
                    <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
                        <Text>ADD</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#edf2f9",
        borderRadius: 10,
        shadowColor: "blue",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        margin: 10,
        padding: 10,
    },
    itemTitle: {
        fontSize: 20,
        fontWeight: "semibold",
        marginBottom: 5,
    },
    itemPrice: {
        fontSize: 12,
        marginBottom: 5,
    },
    itemDescription: {
        fontSize: 12,
        color: "gray",
    },
    addButton: {
        color: "#bac8cd",
        backgroundColor: "#dee5ea",
        padding: 5,
        borderRadius: 5,
        marginTop: 10,
        borderWidth: 1,
        borderColor: "#5a7d9a",
        width: 70,
        justifyContent: "center",
        alignItems: "center",
    },
    quantityControls: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
    },
    quantityButton: {
        backgroundColor: "#dee5ea",
        padding: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#5a7d9a",
        width: 30,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
    },
    quantityText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    quantityValue: {
        marginHorizontal: 10,
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default Card;
