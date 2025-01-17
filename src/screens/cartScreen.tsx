import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { removeItemFromCart, updateItemQuantity } from '../redux/actions/cartActions';

const CartScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart); // Access the cart state

  const handleIncrease = (item) => {
    dispatch(updateItemQuantity(item, item.quantity + 1));
  };

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      dispatch(updateItemQuantity(item, item.quantity - 1));
    } else {
      dispatch(removeItemFromCart(item.name)); // Remove item if quantity goes to 0
    }
  };

  return (
    <View style={styles.container}>
      {cart.length === 0 ? (
        <Text style={styles.emptyText}>Your cart is empty.</Text>
      ) : (
        cart.map((item) => (
          <View key={item.name} style={styles.cartItem}>
            <Text style={styles.itemName}>{item.name}</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => handleDecrease(item)}>
                <Text style={styles.button}>-</Text>
              </TouchableOpacity>
              <Text>{item.quantity}</Text>
              <TouchableOpacity onPress={() => handleIncrease(item)}>
                <Text style={styles.button}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => dispatch(removeItemFromCart(item.name))}>
              <Text style={styles.removeButton}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'gray',
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    fontSize: 20,
    paddingHorizontal: 10,
  },
  removeButton: {
    color: 'red',
    marginLeft: 10,
    fontSize: 14,
  },
});

export default CartScreen;
