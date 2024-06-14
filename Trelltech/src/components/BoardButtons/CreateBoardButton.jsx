import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import createNewBoard from '../../../api/boards/CreateBoard';

const CreateBoardButton = ({ onPress, title }) => (
    <TouchableOpacity onPress={createNewBoard}  style={styles.button}>
      <Text>Create New Board</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'pink',
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

export default CreateBoardButton;