import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

const Header: React.FC = () => {
    return (
        <View style={styles.header}>
            <Image source={require('../../assets/Hanuman_Logo.png')} style={styles.headerLogo} resizeMode='contain' />
            <Text style={styles.headerTitle}>Sri Maruthi Sweets</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent:'flex-start',
        alignItems: 'center',
        padding: 10,
        paddingTop: 30,
        backgroundColor: '#fff',
        borderBottomWidth:0.6,
        borderBottomColor:'grey'
    },
    headerLogo: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default Header;