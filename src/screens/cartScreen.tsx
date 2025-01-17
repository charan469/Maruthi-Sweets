import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { removeItemFromCart, updateItemQuantity } from '../redux/actions/cartActions';

const CartScreen = () => {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart.cart);  // Access the cart state

  const handleIncrease = (item) => {
    dispatch(updateItemQuantity(item, item.quantity + 1));
  };

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      dispatch(updateItemQuantity(item, item.quantity - 1));
    }
  };

  const handleRemove = (item) => {
    dispatch(removeItemFromCart(item));
  };

  return (
    <View style={styles.container}>
      {cart.map((item) => (
        <View key={item.name} style={styles.cartItem}>
          <Text>{item.name}</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={() => handleDecrease(item)}>
              <Text style={styles.button}>-</Text>
            </TouchableOpacity>
            <Text>{item.quantity}</Text>
            <TouchableOpacity onPress={() => handleIncrease(item)}>
              <Text style={styles.button}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => handleRemove(item)}>
            <Text style={styles.removeButton}>Remove</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
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
  },
});

export default CartScreen;
