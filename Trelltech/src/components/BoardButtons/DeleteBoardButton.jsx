import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import deleteBoard from '../../../api/boards/DeleteBoard';

const DeleteBoardButton = ({ onPress, title, visible }) => (
  visible && (
    <TouchableOpacity onPress={deleteBoard} style={styles.button}>
      <Text>{title}</Text>
    </TouchableOpacity>
  )
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#9b2226',
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

export default DeleteBoardButton;
