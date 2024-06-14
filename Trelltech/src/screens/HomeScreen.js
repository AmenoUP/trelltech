import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Modal, TextInput, ScrollView } from 'react-native';
import fetch from 'node-fetch';
import { Alert } from 'react-native';

import { apiKey, apiToken } from '../../api/config';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import fetchUserInfo from '../../api/workspace/userInfo';
import fetchWorkspaces from '../../api/workspace/fetchWorkspace';
import createWorkspace from '../../api/workspace/createWorkspace';
import deleteWorkspace from '../../api/workspace/deleteWorkspace';
import updateWorkspace from '../../api/workspace/updateWorkspace';

const HomeScreen = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisibleSettings, setModalVisibleSettings] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const { isDarkTheme, toggleTheme } = useTheme();
  const [deleteAccount, setDeleteAccount] = useState(false);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [isUpdatingWorkspace, setIsUpdatingWorkspace] = useState(false);

  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfoData = async () => {
      const userData = await fetchUserInfo();
      setUserInfo(userData);
    };

    fetchUserInfoData();
  }, []);

  const currentStyles = isDarkTheme ? {...styles, ...darkThemeStyles} : styles;

  useEffect(() => {
    const fetchWorkspacesData = async () => {
      const workspaceData = await fetchWorkspaces();
      setWorkspaces(workspaceData);
    };

    fetchWorkspacesData();
  }, [refreshing]);

  
  const settingsModal = () => {
    setModalVisibleSettings(!isModalVisibleSettings);
  };

  const toggleModal = () => {
    setUpdateModalVisible(false);
    setNewWorkspaceName('');
  };

  const toggleCreateModal = () => {
    setModalVisible(true);
  };

  const handleCreateWorkspace = async () => {
    if (!newWorkspaceName) {
      // Vérifiez si le nom de l'espace de travail est saisi
      Alert.alert('Error', 'Please enter a workspace name.');
      return;
    }
  
    // Vérifiez si le nom de l'espace de travail commence ou se termine par un espace
    if (newWorkspaceName.trim() !== newWorkspaceName) {
      Alert.alert('Error', 'Workspace name cannot start or end with a space.');
      return;
    }
  
    const success = await createWorkspace(newWorkspaceName);
    if (success) {
      setRefreshing(true);
    } else {
      Alert.alert('Error', 'Failed to create workspace.');
    }
    setModalVisible(false);
  };
  
  
  

  const handleDeleteWorkspace = async (workspaceId) => {
    const success = await deleteWorkspace(workspaceId); // Appel de la fonction deleteWorkspace
    if (success) {
      setRefreshing(true);
    } else {
      Alert.alert('Error', 'Failed to delete workspace.');
    }
  };

  const handleUpdateWorkspace = async () => {
    setIsUpdatingWorkspace(true); // Définit l'état de mise à jour en cours à true
    try {
      const success = await updateWorkspace(selectedWorkspaceId, newWorkspaceName);
      if (success) {
        setRefreshing(true); // Déclenche le rafraîchissement seulement si la mise à jour a réussi
        setUpdateModalVisible(false); // Ferme la modal après la mise à jour réussie
      } else {
        Alert.alert('Error', 'Failed to update workspace.');
      }
    } finally {
      setIsUpdatingWorkspace(false); // Rétablit l'état de mise à jour en cours à false, que la mise à jour ait réussi ou échoué
    }
  };
  

  return (
    <View style={currentStyles.container}>
      <View style={currentStyles.header}>
        <TouchableOpacity onPress={settingsModal} style={currentStyles.menuBurger}>
          <Text>☰</Text>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisibleSettings}
          onRequestClose={() => setModalVisibleSettings(false)}
        >
          <View style={currentStyles.modalContainer}>
            <View style={currentStyles.modalContent}>
              <Text style={currentStyles.modalTitle}>Account</Text>
              {/* Affichez les informations de l'utilisateur ici */}
              {userInfo && (
                <>
                  <View style={currentStyles.infoContainer}>
                    <Text style={currentStyles.infoLabel}>User :{userInfo.fullName}</Text>
                  </View>
                  <View style={currentStyles.infoContainer}>
                    <Text style={currentStyles.infoLabel}>Email: {userInfo.email}</Text>
                  </View>

                  <Text style={currentStyles.modalTitle}>Settings</Text>
              <Button
                onPress={toggleTheme}
                title={isDarkTheme ? "Switch to clear theme" : "Switch to dark theme"}
                color={isDarkTheme ? "#004d4d" : "#006666"}
              />
              <TouchableOpacity
                  style={[currentStyles.modalButton, currentStyles.cancelButton]}
                  onPress={settingsModal}
                >
                <Text style={currentStyles.buttonText}>Cancel</Text>
              </TouchableOpacity>
                  
                </>
              )}
            </View>
          </View>
        </Modal>

        <Text style={currentStyles.headerTitle}>Choose a workspace</Text>
      </View>
      
      <ScrollView
        style={currentStyles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(false);
            }}
          />
        }
      >
        {workspaces.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={currentStyles.workspaceItem}
            onPress={() => {
              navigation.navigate('BoardScreen', { workspaceId: item.id });
            }}
            onLongPress={() => {
              setSelectedWorkspaceId(item.id);
              setUpdateModalVisible(true);
            }}
          >
            <Text style={currentStyles.workspaceItemTitle}>{item.displayName}</Text>
            <TouchableOpacity onPress={() => handleDeleteWorkspace(item.id, item.displayName)} style={styles.deleteButtonContainer}>
              <Icon name="trash-o" size={20} color="black" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={currentStyles.createButton}
        onPress={toggleCreateModal}
      >
        <Text style={currentStyles.buttonText}>Create a workspace</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={currentStyles.modalContainer}>
          <View style={currentStyles.modalContent}>
            <Text style={currentStyles.modalTitle}>Create a new workspace</Text>
            <TextInput
              style={currentStyles.input}
              placeholder="Workspace Name"
              value={newWorkspaceName}
              onChangeText={setNewWorkspaceName}
            />
            <TouchableOpacity
              style={currentStyles.modalButton}
              onPress={() => {
                handleCreateWorkspace();
                setModalVisible(false);
              }}
            >
              <Text style={currentStyles.buttonText}>Create</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[currentStyles.modalButton, currentStyles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={currentStyles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      <Modal
        animationType="slide"
        transparent={true}
        visible={updateModalVisible} // Utiliser updateModalVisible ici
        onRequestClose={() => setUpdateModalVisible(false)} // Assurez-vous de gérer la fermeture de la modal
      >

        <View style={currentStyles.modalContainer}>
          <View style={currentStyles.modalContent}>
            <Text style={currentStyles.modalTitle}>Update a workspace</Text>
            <TextInput
              style={currentStyles.input}
              placeholder="Workspace Name"
              value={newWorkspaceName}
              onChangeText={setNewWorkspaceName}
            />
            <View style={currentStyles.buttonContainer}>
            <TouchableOpacity
              style={[currentStyles.modalButton, isUpdatingWorkspace && { opacity: 0.5 }]} // Désactive le clic lorsque la mise à jour est en cours
              onPress={handleUpdateWorkspace}
              disabled={isUpdatingWorkspace} // Empêche également le clic lorsque la mise à jour est en cours
            >
              <Text style={currentStyles.buttonText}>Update</Text>
            </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    width: '100%', 
    justifyContent: 'flex-start',
    marginBottom: 10,
    marginTop: 0,
  },
  headerTitle: {
    fontSize: 26,
    color: '#607058',
    fontWeight: 'bold',
  },
  menuBurger: {
    marginRight: 20,
  },
  scrollView: {
    padding: 0,
    width: '80%',
  },
  workspaceItem: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center', 
    justifyContent: 'space-between', 
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    
  },
  workspaceItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#454787',
  },
  createButton: {
    backgroundColor: '#714587',
    padding: 12,
    borderRadius: 5,
    margin: 10,
    width: '50%',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    height: 45,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    borderRadius: 5,
    width: '40%',
    backgroundColor: '#004d4d',
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  cancelButton: {
    backgroundColor: '#607058',
  },
  deleteButtonContainer: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  deleteButton: {
    borderRadius: 5,
    padding: 10,
  },
  deleteButtonText: {
    color: "#ffffff", 
    textAlign: "center",
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const darkThemeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8c8c8c', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    width: '100%',
    justifyContent: 'flex-start',
    marginBottom: 10,
    marginTop: 0,
  },
  headerTitle: {
    fontSize: 26,
    color: '#704241', 
    fontWeight: 'bold',
  },
  menuBurger: {
    marginRight: 20,
  },
  scrollView: {
    padding: 0,
    width: '80%',
  },
  workspaceItem: {
    width: '100%',
    backgroundColor: '#737373', 
    padding: 20,
    borderRadius: 10,
    borderColor: '#404040',
    borderWidth: 0.4,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    // shadowOpacity: 1.25,
    // shadowRadius: 8,
    elevation: 6,
  },
  workspaceItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#D3D3D3',
  },
  createButton: {
    backgroundColor: '#344e41', 
    padding: 12,
    borderRadius: 5,
    margin: 10,
    width: '50%',
  },
  buttonText: {
    color: '#E0E0E0', 
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8c8c8c', 
    padding: 25,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#D3D3D3',
  },
  input: {
    height: 45,
    width: '100%',
    borderColor: '#404040',
    borderWidth: 0.4,
    borderRadius: 5,
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#737373',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: '40%',
    backgroundColor: '#344e41', 
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  cancelButton: {
    backgroundColor: '#704241', 
  },
  deleteButton: {
    //backgroundColor: "#3E2723", 
    borderRadius: 5,
    padding: 10,
    width: '40%',
    marginTop: 10,
  },
  deleteButtonText: {
    color: "#E0E0E0", 
    textAlign: "center",
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
