import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import deleteList from '../../../api/lists/DeleteLists';

const DeleteListButton = ({ onPress, title }) => (
    <TouchableOpacity onPress={deleteList}  style={styles.button}>
      <Text>Delete a List</Text>
    </TouchableOpacity>
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

export default DeleteListButton;