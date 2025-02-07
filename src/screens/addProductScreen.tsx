import React, { useState } from 'react';
import {
    View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { API_BASE_URL } from '@env';
import { useDispatch } from 'react-redux';
import { addNewProduct } from '../redux/actions/productsActions';

const AddProduct = ({ navigation }) => {
    const dispatch = useDispatch();
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [imageUri, setImageUri] = useState(null);
    const [showAvailable, setShowAvailable] = useState(true);
    const [isUploading, setIsUploading] = useState(false);

    // Pick image from gallery
    const handleChoosePhoto = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        console.log("ImagePicker Result:", result);

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    // Take photo with camera
    const handleTakePhoto = async () => {
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 1,
        });

        console.log("Camera Capture Result:", result);

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    // Upload image to backend
    const uploadImageToBackend = async () => {
        if (!imageUri) {
            Alert.alert("Error", "Please select an image first.");
            return null;
        }

        let formData = new FormData();
        formData.append('file', {
            uri: imageUri,
            name: `product_${Date.now()}.jpg`,
            type: 'image/jpeg',
        });

        console.log("Uploading Image: ", imageUri);
        console.log("FormData: ", formData);

        try {
            setIsUploading(true);
            let response = await fetch(`${API_BASE_URL}upload-image`, {
                method: 'POST',
                body: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            let data = await response.json();
            console.log("Image Upload Response:", data);

            if (!data.imageUrl) {
                throw new Error("Image upload failed - No imageUrl returned");
            }

            return data.imageUrl; // URL of uploaded image from backend
        } catch (error) {
            console.error("Image upload failed:", error);
            Alert.alert("Error", "Image upload failed. Please check your AWS credentials or API.");
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    // Add product (Upload Image + Save Product)
    const handleAddProduct = async () => {
        if (!productName || !productPrice || !imageUri) {
            Alert.alert("Error", "All fields are required");
            return;
        }

        console.log("Adding Product with:", {
            productName,
            productPrice,
            imageUri,
            showAvailable
        });

        // Upload image first
        const uploadedImageUrl = await uploadImageToBackend();
        if (!uploadedImageUrl) {
            console.error("Image upload failed. Product creation aborted.");
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}create-product`, {
                product_name: productName,
                product_price: parseFloat(productPrice),
                product_image_url: uploadedImageUrl,
                show_available: showAvailable
            });

            console.log("Product Created Successfully:", response.data);

            dispatch(addNewProduct(response.data.product));
            setProductName('');
            setProductPrice('');
            setImageUri(null);
            Alert.alert("Success", "Product added successfully!");
        } catch (error) {
            console.error("Error adding product:", error.response ? error.response.data : error);
            Alert.alert("Error", "Failed to add product. Please try again.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add New Product</Text>
            <TextInput
                placeholder="Product Name"
                style={styles.input}
                value={productName}
                onChangeText={setProductName}
            />
            <TextInput
                placeholder="Product Price"
                style={styles.input}
                value={productPrice}
                onChangeText={setProductPrice}
                keyboardType="numeric"
            />

            <TouchableOpacity style={styles.imagePicker} onPress={handleChoosePhoto}>
                <Text style={styles.buttonText}>Choose Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imagePicker} onPress={handleTakePhoto}>
                <Text style={styles.buttonText}>Take Photo</Text>
            </TouchableOpacity>

            {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}

            <Button title={isUploading ? "Uploading..." : "Add Product"} onPress={handleAddProduct} disabled={isUploading} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#f9f9f9' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5, backgroundColor: 'white' },
    imagePicker: { backgroundColor: '#007bff', padding: 10, marginBottom: 10, borderRadius: 5, alignItems: 'center' },
    buttonText: { color: 'white', fontWeight: 'bold' },
    imagePreview: { width: 100, height: 100, alignSelf: 'center', marginVertical: 10 }
});

export default AddProduct;
