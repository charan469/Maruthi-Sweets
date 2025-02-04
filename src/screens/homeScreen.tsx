import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Card from '../components/card';
import axios from 'axios';
import { API_BASE_URL } from '@env';

interface Product {
  product_name: string;
  product_price: number;
  product_image_url: string;
  show_available: boolean;
}

const HomeScreen = ({ navigation }) => {


  const [allProducts, setAllProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const fetchAllProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}get-all-products`, {
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      setAllProducts(response.data);
    } catch (err) {
      console.error("Error fetching all products:", err);
      setError("Failed to fetch all products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);
  return (
    <View style={styles.screenContainer}>
      <Text style={{ fontSize: 24, fontStyle: 'italic', padding: 8, fontWeight: '300' }}>
        <Text style={{ fontWeight: '600' }}>Om Namaha Sivaya</Text> Krishna Garu
      </Text>

      <FlatList
        data={allProducts}
        renderItem={({ item }) => <Card item={item} />}
        keyExtractor={(item) => item.product_name}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddProduct")}
      >
        <Text style={styles.plusIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
};
export default HomeScreen;
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#bac8cd',
  },
  addButton: {
    height: 50,
    width: 50,
    backgroundColor: 'white',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 40,
    right: 20,
  },
  plusIcon: {
    fontSize: 32,
    color: 'orange',
  },
});