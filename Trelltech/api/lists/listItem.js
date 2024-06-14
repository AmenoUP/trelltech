// ListItem.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ListItem = ({ list, fetchLists }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [editedListName, setEditedListName] = useState(list.name);

  const handleEditPress = () => {
    setModalVisible(true);
  };

  const handleSavePress = () => {
    // Implement logic to save the edited list name
    // For example, update the state or call an API to persist the changes
    setModalVisible(false);
    // You may need to refresh the lists after editing
    fetchLists();
  };

  return (
    <View style={styles.listItem}>
      <Text style={styles.listTitle}>{list.name}</Text>
      <TouchableOpacity onPress={handleEditPress} style={styles.editIcon}>
        <Icon name="ellipsis-h" size={20} color="#000" />
      </TouchableOpacity>

      {isModalVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Modifier la Liste</Text>
              <TextInput
                style={styles.input}
                placeholder="Nouveau nom de la liste"
                value={editedListName}
                onChangeText={setEditedListName}
              />
              <Button title="Enregistrer" onPress={handleSavePress} />
              <Button title="Annuler" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default ListItem;
