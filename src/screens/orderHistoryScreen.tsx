import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

const OrderHistoryScreen = () => {
  const orderHistory = useSelector((state: any) => state.orderHistory.orderHistory);

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
                Order Date: {new Date(item.orderDate).toLocaleString()}
              </Text>
              <Text style={styles.customerName}>
                Customer: {item.deliveryDetails.customerName}
              </Text>
              <Text>Delivery Address: {item.deliveryDetails.city}, {item.deliveryDetails.deliveryPoint}</Text>
              <Text>Delivery Date: {item.deliveryDetails.deliveryDate}</Text>
              <Text>Seller Contact: {item.sellerPhone}</Text>
              <FlatList
                data={item.cartItems}
                keyExtractor={(cartItem, cartIndex) => cartIndex.toString()}
                renderItem={({ item: cartItem }) => (
                  <Text>
                    {cartItem.name} x {cartItem.quantity} = Rs.{" "}
                    {cartItem.price * cartItem.quantity}
                  </Text>
                )}
              />
              <Text style={styles.totalPrice}>
                Total Price: Rs. {item.totalPrice}
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
