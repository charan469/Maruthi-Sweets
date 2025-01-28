import React, { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios"; // Assuming you use Axios for API calls
import { saveAllOrders } from "../redux/reducers/orderHistoryReducer";
import { useFocusEffect } from "@react-navigation/native";

const baseUrl = "http://192.168.1.10:5000/api/get-all-orders";

const OrderHistoryScreen = () => {
  const orderHistory = useSelector((state: any) => state.orderHistory.orderHistory);
  console.log("orderHistory redux------->",orderHistory)
  const dispatch = useDispatch();
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${baseUrl}`, {
        headers: {
          "Cache-Control": "no-cache", // Disable client-side caching
        },
        params: {
          timestamp: new Date().getTime(), // Add a unique query parameter
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  useFocusEffect(
    useCallback(()=>{
      const getOrders = async () => {
        try {
          const response = await fetchOrders();
          console.log("Orders fetched:", response);
          dispatch(saveAllOrders(response));
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      };
    
      getOrders();

      return () => {
        console.log("Order history screen unfocused, use cleanup if required");
      };

    },[])
  )
 



  return (
    <View style={styles.container}>
      {orderHistory.length === 0 ? (
        <Text style={styles.emptyText}>No orders found.</Text>
      ) : (
        <FlatList
          data={orderHistory}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.orderCard}>
              <Text style={styles.orderDate}>
                Order Id: {item.order_id}
              </Text>
              <Text style={styles.orderDate}>
                Order Date: {new Date(item.order_date).toLocaleString()}
              </Text>
              <Text style={styles.customerName}>
                Customer Name: {item?.name}
              </Text>
              <Text>Delivery Address: {item?.city}, {item?.delivery_point}</Text>
              <Text>Delivery Date: {item?.delivery_date}</Text>
              <Text>Customer Contact: {item.mobile_number}</Text>
              <FlatList
                data={item.cart_items}
                keyExtractor={(cartItem, cartIndex) => cartIndex.toString()}
                renderItem={({ item: cartItem }) => (
                  <Text>
                    {cartItem.name} x {cartItem.quantity} = Rs.{" "}
                    {cartItem.price * cartItem.quantity}
                  </Text>
                )}
              />
              <Text style={styles.totalPrice}>
                Total Price: Rs. {item.total_price}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 18,
    color: "gray",
  },
  orderCard: {
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderDate: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  customerName: {
    fontSize: 16,
    marginBottom: 5,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
});

export default OrderHistoryScreen;
