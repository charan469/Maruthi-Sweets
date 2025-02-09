import React, { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios"; // Assuming you use Axios for API calls
import { saveAllOrders } from "../redux/reducers/orderHistoryReducer";
import { useFocusEffect } from "@react-navigation/native";
import { API_BASE_URL } from '@env';

const OrderHistoryScreen = () => {
  const orderHistory = useSelector((state: any) => state.orderHistory.orderHistory);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}get-all-orders`, {
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      setIsLoading(false);
      return response.data;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const changeOrderStatus = async (item) => {
    try {
      setIsLoading(true);
      const { order_id, order_status } = item;
      await axios.put(`${API_BASE_URL}change-order-status`, { order_id, order_status: "Accepted" });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Error", "Failed to update Order Status.");
    }
  };

  useFocusEffect(
    useCallback(() => {
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

    }, [])
  );

  const tabs = [
    { id: "1", title: "placed" },
    { id: "2", title: "New Order" },
    { id: "3", title: "Accepted" },
    { id: "4", title: "Delivered" },
  ];
  const [selectedTab, setSelectedTab] = useState(tabs[0].id);

  return (
    <View style={styles.container}>
      <View>
        <FlatList
          data={tabs}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.tab, selectedTab === item.id && styles.selectedTab]}
              onPress={() => setSelectedTab(item.id)}
            >
              <Text style={[styles.tabText, selectedTab === item.id && styles.selectedTabText]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="blue" style={styles.loader} />
      ) : orderHistory.length === 0 ? (
        <Text style={styles.emptyText}>No orders found.</Text>
      ) : (
        <FlatList
          data={orderHistory.filter((order) => order.order_status === tabs.find(tab => tab.id === selectedTab).title)}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.orderCard}>
              <Text style={styles.orderDate}>Order Id: {item.order_id}</Text>
              <Text style={styles.orderDate}>Order Date: {new Date(item.order_date).toLocaleString()}</Text>
              <Text style={styles.customerName}>Customer Name: {item?.name}</Text>
              <Text style={styles.deliveryDetails}>Delivery Address: {item?.city}, {item?.delivery_point}</Text>
              <Text style={styles.deliveryDetails}>Delivery Date: {item?.delivery_date}</Text>
              <Text style={styles.deliveryDetails}>Customer Contact: {item.mobile_number}</Text>
              <Text style={styles.deliveryDetails}>Order Status: {item.order_status}</Text>
              <TouchableOpacity style={styles.changeStatusButton} onPress={() => changeOrderStatus(item)}>
                <Text style={styles.buttonText}>Change Order Status</Text>
              </TouchableOpacity>
              <FlatList
                data={item.cart_items}
                keyExtractor={(cartItem, cartIndex) => cartIndex.toString()}
                renderItem={({ item: cartItem }) => (
                  <Text style={styles.deliveryDetails}>
                    {cartItem.product_name} x {cartItem.quantity} = Rs. {cartItem.product_price * cartItem.quantity}
                  </Text>
                )}
              />
              <Text style={styles.totalPrice}>Total Price: Rs. {item.total_price}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "pink",
    flex: 1,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 18,
    color: "gray",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  customerName: {
    fontSize: 20,
    marginBottom: 5,
  },
  deliveryDetails: {
    fontSize: 20,
    marginBottom: 5,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  tab: {
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    height: 50,
  },
  selectedTab: {
    borderBottomColor: "blue",
  },
  tabText: {
    fontSize: 24,
    color: "gray",
  },
  selectedTabText: {
    color: "blue",
  },
  changeStatusButton: {
    padding: 10,
    backgroundColor: 'green',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default OrderHistoryScreen;
