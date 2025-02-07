import axios from "axios";
import React, { useState } from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity, Switch, Alert } from "react-native";
import { API_BASE_URL } from '@env';
import { deleteProduct, updateProductAvailability } from "../redux/actions/productsActions";
import { useDispatch } from "react-redux";

interface CardProps {
    item: {
        product_id: string;
        product_name: string;
        product_price: number;
        product_image_url: string;
        show_available: boolean;
    };
}
interface Item {
    product_id: string;
    product_name: string;
    product_price: number;
    product_image_url: string;
    show_available: boolean;
}
const Card: React.FC<CardProps> = ({ item }) => {
    const dispatch = useDispatch();
    const toggleSwitch = async (item: Item): Promise<void> => {
        try {
            const { product_id, show_available } = item;
            await axios.put(`${API_BASE_URL}change-product-availability`, {
                product_id,
                newStatus: !show_available, // Send the toggled value
            });
            dispatch(updateProductAvailability(product_id, !show_available));
        } catch (error) {
            console.error("Error changing availability:", error);
            Alert.alert("Error", "Failed to update product availability.");
        }
    };


    const handleDelete = async (item: Item): Promise<void> => {
        try {
            console.log("item----------------------", item)
            const { product_id } = item; // Replace with actual product ID
            const response = await axios.delete(`${API_BASE_URL}delete-product`, {
                data: { product_id }, // `data` is required for DELETE requests in Axios
            });
            dispatch(deleteProduct(product_id));
            Alert.alert("Success", response.data.message);
        } catch (error) {
            console.error("Error deleting product:", error);
            Alert.alert("Error", "Failed to delete product.");
        }
    }

    return (
        <View style={styles.card}>
            <View style={{
                flexDirection: 'row',
                justifyContent:'space-between',
                alignItems:'center',
            }}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitle}>{item.product_name}</Text>
                    <Text style={styles.itemPrice}>Rs{item.product_price}</Text>
                </View>
                <Image
                    source={{ uri: item.product_image_url }}

                    style={{ width: 100, height: 100, borderRadius: 10 }}
                    resizeMode="contain"
                /></View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "center" }}>

                <TouchableOpacity style={{ backgroundColor: 'red', padding: 8, borderRadius: 8 }} onPress={() => { handleDelete(item) }}>
                    <Text style={{ color: 'white' }}>Delete</Text>
                </TouchableOpacity>
                <Switch
                    onValueChange={() => toggleSwitch(item)}
                    value={item.show_available}
                />

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: "column",
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
