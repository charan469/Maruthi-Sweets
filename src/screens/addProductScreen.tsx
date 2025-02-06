import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '@env';
import { useDispatch } from 'react-redux';
import { addNewProduct} from '../redux/actions/productsActions';

const AddProduct = ({ navigation }) => {
    const dispatch = useDispatch();
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productImageUrl, setProductImageUrl] = useState('');
    const [showAvailable, setShowAvailable] = useState(true);

    const handleAddProduct = async () => {
        if (!productName || !productPrice || !productImageUrl) {
            Alert.alert("Error", "All fields are required");
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}create-product`, {
                product_name: productName,
                product_price: parseFloat(productPrice),
                product_image_url: productImageUrl,
                show_available: showAvailable
            });
            console.log("new product--------------->",response.data)
            dispatch(addNewProduct(response.data.product))
            setProductName('');
            setProductPrice('');
            setProductImageUrl('');
            Alert.alert("Success", "Product added successfully!");
            //  navigation.goBack(); // Navigate back to Home
        } catch (error) {
            console.error("Error adding product:", error);
            Alert.alert("Error", "Failed to add product. Please try again.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add New Product</Text>
            <TextInput placeholder="Product Name" style={styles.input} value={productName} onChangeText={setProductName} />
            <TextInput placeholder="Product Price" style={styles.input} value={productPrice} onChangeText={setProductPrice} keyboardType="numeric" />
            <TextInput placeholder="Image URL" style={styles.input} value={productImageUrl} onChangeText={setProductImageUrl} />
            <Button title="Add Product" onPress={handleAddProduct} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#f9f9f9' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5, backgroundColor: 'white' }
});

export default AddProduct;
