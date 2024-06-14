import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import createNewList from '../../../api/lists/CreateLists';

const CreateListButton = ({ onPress, title }) => (
    <TouchableOpacity onPress={createNewList}  style={styles.button}>
      <Text>Create New List</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007bff',
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

export default CreateListButton;