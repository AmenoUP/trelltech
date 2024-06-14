import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import createNewCard from '../../../api/cards/CreateCards';

const CreateCardButton = ({ onPress, title }) => (
    <TouchableOpacity onPress={createNewCard}  style={styles.button}>
      <Text>Create New Card</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  text: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default CreateCardButton;