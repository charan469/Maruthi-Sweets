import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const OrderHistoryScreen = () => {
    return (
      <View style={styles.screenContainer}>
        <Text>Here is your Order History!</Text>
      </View>
    );
  };
export default OrderHistoryScreen;

const styles = StyleSheet.create({

    screenContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f9f9f9',
    },
  });