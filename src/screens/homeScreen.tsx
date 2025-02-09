import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import Card from "../components/card";
import axios from "axios";
import { API_BASE_URL } from "@env";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../redux/actions/productsActions";

interface Product {
  product_id: number;
  product_name: string;
  product_price: number;
  product_image_url: string;
  show_available: boolean;
}

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}get-all-products`, {
          headers: { "Cache-Control": "no-cache" },
        });
        dispatch(setProducts(response.data));
      } catch (err) {
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, [dispatch]);

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>Om Namaha Shivaya Krishna Garu</Text>

      {loading ? (
        <ActivityIndicator size="large" color="blue" style={styles.loader} />
      ) : (
        <FlatList
          data={products}
          renderItem={({ item }) => <Card item={item} />}
          keyExtractor={(item) => item.product_id.toString()}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddProduct")}>
        <Text style={styles.plusIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: "#bac8cd" },
  title: { fontSize: 24, fontStyle: "italic", padding: 8, fontWeight: "300" },
  loader: { flex: 1, justifyContent: "center" },
  addButton: { height: 50, width: 50, backgroundColor: "white", borderRadius: 25, justifyContent: "center", alignItems: "center", position: "absolute", bottom: 40, right: 20 },
  plusIcon: { fontSize: 32, color: "orange" },
});

export default HomeScreen;
