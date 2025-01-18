import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { removeItemFromCart, updateItemQuantity } from "../redux/actions/cartActions";
import { saveOrder } from "../redux/reducers/orderHistoryReducer";

import { NavigationProp } from '@react-navigation/native';

const CartScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state: { cart: { cart: CartItem[] } }) => state.cart.cart);
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDeliveryPoint, setSelectedDeliveryPoint] = useState("");
  const [deliveryPoints, setDeliveryPoints] = useState<string[]>([]);
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const cities = [
    { name: "Hyderabad", deliveryPoints: ["JNTU", "MG Bus Stand", "Miyapur"] },
    { name: "Chennai", deliveryPoints: ["Koyambedu", "Tambaram", "Guindy"] },
    { name: "Bangalore", deliveryPoints: ["Majestic", "KR Market", "Electronic City"] },
  ];

  interface City {
    name: string;
    deliveryPoints: string[];
  }

  interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
  }

  interface OrderDetails {
    cartItems: CartItem[];
    deliveryDetails: {
      customerName: string;
      mobileNumber: string;
      city: string;
      deliveryPoint: string;
      deliveryDate: string;
    };
    totalPrice: number;
    orderDate: string;
  }

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    const cityData = cities.find((c: City) => c.name === city);
    setDeliveryPoints(cityData ? cityData.deliveryPoints : []);
    setSelectedDeliveryPoint("");
  };

  interface DateChangeEvent {
    type: string;
    nativeEvent: {
      timestamp: number;
    };
  }

  const handleDateChange = (event: DateChangeEvent, selectedDate?: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const today = new Date();
      today.setDate(today.getDate() + 1); // Minimum date is tomorrow
      if (selectedDate < today) {
        Alert.alert("Invalid Date", "Delivery date must be at least one day from today.");
      } else {
        setDeliveryDate(selectedDate);
      }
    }
  };

  const handlePlaceOrder = () => {
    if (!customerName || !mobileNumber || !selectedCity || !selectedDeliveryPoint) {
      Alert.alert("Error", "Please fill all the delivery details.");
      return;
    }
  
    const orderDetails = {
      cartItems: cart,
      deliveryDetails: {
        customerName,
        mobileNumber,
        city: selectedCity,
        deliveryPoint: selectedDeliveryPoint,
        deliveryDate: deliveryDate.toISOString().split("T")[0], // Add delivery date
      },
      sellerPhone: "9989325599", // Add seller phone number
      totalPrice,
      orderDate: new Date().toISOString(),
    };
  
    dispatch(saveOrder(orderDetails));
    cart.forEach((item) => dispatch(removeItemFromCart(item.name)));
  
    Alert.alert("Success", "Order placed successfully!", [
      {
        text: "OK",
        onPress: () => navigation.navigate("Order History"),
      },
    ]);
  
    setCustomerName("");
    setMobileNumber("");
    setSelectedCity("");
    setSelectedDeliveryPoint("");
    setDeliveryPoints([]);
    setDeliveryDate(new Date());
  };
  
  return (
    <ScrollView style={styles.container}>
      {cart.length === 0 ? (
        <Text style={styles.emptyText}>Your cart is empty.</Text>
      ) : (
        <>
          {cart.map((item) => (
            <View key={item.name} style={styles.cartItem}>
              <Text style={styles.itemName}>{item.name}</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={() => dispatch(updateItemQuantity(item, item.quantity - 1))}>
                  <Text style={styles.button}>-</Text>
                </TouchableOpacity>
                <Text>{item.quantity}</Text>
                <TouchableOpacity onPress={() => dispatch(updateItemQuantity(item, item.quantity + 1))}>
                  <Text style={styles.button}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <View style={styles.form}>
            <Text style={styles.sectionTitle}>Delivery Details</Text>
            <TextInput
              placeholder="Customer Name"
              value={customerName}
              onChangeText={setCustomerName}
              style={styles.input}
            />
            <TextInput
              placeholder="Mobile Number"
              value={mobileNumber}
              onChangeText={setMobileNumber}
              keyboardType="phone-pad"
              style={styles.input}
            />
            <Picker selectedValue={selectedCity} style={styles.picker} onValueChange={handleCityChange}>
              <Picker.Item label="Select City" value="" />
              {cities.map((city) => (
                <Picker.Item key={city.name} label={city.name} value={city.name} />
              ))}
            </Picker>
            {deliveryPoints.length > 0 && (
              <Picker
                selectedValue={selectedDeliveryPoint}
                style={styles.picker}
                onValueChange={(value) => setSelectedDeliveryPoint(value)}
              >
                <Picker.Item label="Select Delivery Point" value="" />
                {deliveryPoints.map((point) => (
                  <Picker.Item key={point} label={point} value={point} />
                ))}
              </Picker>
            )}
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.datePickerText}>
                {`Delivery Date: ${deliveryDate.toISOString().split("T")[0]}`}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={deliveryDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "calendar"}
                onChange={handleDateChange}
                minimumDate={new Date(Date.now() + 86400000)} // At least one day later
              />
            )}
          </View>
          <View style={styles.cartItem}>
            <Text>Total</Text>
            <Text>{totalPrice}</Text>
          </View>
          <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
            <Text style={styles.placeOrderText}>Place Order</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 18,
    color: "gray",
  },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    fontSize: 20,
    paddingHorizontal: 10,
  },
  form: {
    marginVertical: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  placeOrderButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  placeOrderText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  datePickerButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
  },
  datePickerText: {
    fontSize: 16,
  },
});

export default CartScreen;
