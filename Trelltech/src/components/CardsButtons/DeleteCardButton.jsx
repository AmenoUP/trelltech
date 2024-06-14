import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import deleteCard from '../../../api/cards/DeleteCards';

const DeleteCardButton = ({ onPress, title }) => (
    <TouchableOpacity onPress={deleteCard}  style={styles.button}>
      <Text>DeleteCard</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'violet',
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

export default DeleteCardButton;