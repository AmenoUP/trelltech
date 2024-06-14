import React from 'react';
import { TouchableOpacity, Image, StyleSheet, View } from 'react-native';

const GetMemberButton = ({ onPress, avatarUrl }) => (
  <TouchableOpacity onPress={onPress} style={styles.button}>
    <View style={styles.avatarContainer}>
      <Image source={{ uri: avatarUrl }} style={styles.avatar} />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    padding: 5,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', // Pour s'assurer que l'image reste dans le cercle
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
});

export default GetMemberButton;
