import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Card from '../components/card';

const HomeScreen = () => {

  const items = [
    {
      name: "Putharekulu Box",
      price: 150,
      description: "Made of rice paper and dry fruits, jaggery, ghee...more",
    },
    {
      name: "Putharekulu Box SP",
      price: 230,
      description: "Made of rice paper and dry fruits, jaggery, ghee...more",
    }
  ]
  return (
    <View style={styles.screenContainer}>
      <FlatList
        data={items}
        renderItem={({ item }) => 
            <Card item={item} />
        }
        keyExtractor={(item) => item.name}

      />
    </View>
  );
};
export default HomeScreen;
const styles = StyleSheet.create({

  screenContainer: {
    flex: 1,
    backgroundColor: '#bac8cd',
  },
});