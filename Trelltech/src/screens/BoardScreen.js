import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Button, Alert, RefreshControl, Modal, TextInput } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import CreateBoardButton from '../components/BoardButtons/CreateBoardButton';
import { apiKey, apiToken } from '../../api/config';
import DeleteBoardButton from '../components/BoardButtons/DeleteBoardButton';
import { APIKey, APIToken } from '../../api/config';
import { deleteNewBoard } from '../../api/boards/DeleteBoard';
import  updateBoard  from '../../api/boards/UpdateBoard';
import { useTheme } from '../contexts/ThemeContext';
import GetMemberButton from '../components/MembersButton/get_members';
import { getBoard } from '../../api/boards/getBoard';
import { getBoardBackground } from '../../api/boards/getBoardBg'

const BoardScreen = ({ route }) => {
  const navigation = useNavigation();
  const [backgroundImageScaled]=useState();
  const [boards, setBoards] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditBoardModalVisible ,setEditBoardModalVisible] = useState(false);
  const [isModalVisibleSettings, setModalVisibleSettings] = useState(false);
  const [isModalVisibleEdit, setModalVisibleEdit] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [boardNewName, setBoardNewName] = useState('');
  const [showDeleteButton, setShowDeleteButton] = useState(true);
  const [selectedBoardForEdit, setSelectedBoardForEdit] = useState(null);
  const [IsEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isUpdatingBoard, setIsUpdatingBoard] = useState(false);

  const [boardBackground, setBoardBackground] = useState('');

  
  const toggleEditModal = (boardId) => {
    setSelectedBoardForEdit(boardId); // Sélectionner le tableau à éditer
    setNewBoardName(''); // Effacer le nom précédent
    setModalVisibleEdit(!isModalVisibleEdit); // Basculer la visibilité de la modal d'édition
  };
  

  const { workspaceId } = route.params;

  const { isDarkTheme, toggleTheme } = useTheme();

  const currentStyles = isDarkTheme ? {...styles, ...darkThemeStyles} : styles;

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const onOpenCreateBoardModal = () => {
    setModalVisible(true);
  };

  const createNewBoard = async (name, organizationId) => {
    try {
      const response = await fetch(`https://api.trello.com/1/boards/?name=${name}&idOrganization=${organizationId}&key=${apiKey}&token=${apiToken}`, {
        method: 'POST'
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const boardData = await response.json();
      console.log('Nouveau tableau créé:', boardData);
  
      // Vous pouvez utiliser l'id de l'organisation ici pour enregistrer le tableau dans le bon workspace
      return boardData.id;
    } catch (error) {
      console.error('Erreur lors de la création du tableau:', error);
      throw error;
    }
  };
  

  const onCreateBoard = () => {
    setModalVisible(true);
    const { workspaceId } = route.params;
    setOrganizationId(workspaceId);
  };
  

  const addNewBoard = async () => {
    try {
      const { workspaceId } = route.params;
      const newBoardId = await createNewBoard(newBoardName, workspaceId);
      setBoards([...boards, { id: newBoardId, name: newBoardName }]);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du tableau:', error);
    } finally {
      setModalVisible(false);
    }
  };
  

  const deleteBoard = async (boardId) => {
    try {
      await deleteNewBoard(boardId);
      setBoards(boards.filter((board) => board.id !== boardId));
      Alert.alert('Successful deletion', 'The table has been successfully deleted');
    } catch (error) {
      Alert.alert('Deletion error', `An error has occurred : ${error.message}`);
    }
  };

  const handleSaveChanges = async (boardId) => {
    setIsUpdatingBoard(true); // Définit l'état de mise à jour en cours à true
    try {
      const success = await updateBoard(boardId, newBoardName); // Utilisation de l'API updateBoard pour mettre à jour le board
      if (success) {
        setRefreshing(true); // Déclenche le rafraîchissement seulement si la mise à jour a réussi
        setEditBoardModalVisible(false); // Ferme la modal après la mise à jour réussie
      } else {
        Alert.alert('Error', 'Failed to update board.');
      }
    } catch (error) {
      console.error('Error updating board:', error);
      Alert.alert('Error', 'An error occurred while updating board.'); // Gestion de l'erreur avec une alerte
    } finally {
      setIsUpdatingBoard(false); // Rétablit l'état de mise à jour en cours à false, que la mise à jour ait réussi ou échoué
    }
  };
  
  

  const fetchBoards = async (workspaceId) => {
    try {
      const response = await fetch(`https://api.trello.com/1/organizations/${workspaceId}/boards?key=${apiKey}&token=${apiToken}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const boardsData = await response.json();
      setBoards(boardsData);
    } catch (error) {
      console.error('Error fetching boards:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    const { boardId } = route.params; // Extracting boardId from route params
    try {
      const boardData = await getBoard(boardId);
      if (boardData && boardData.backgroundImageScaled && boardData.backgroundImageScaled.length > 0) {
        const backgroundImage = boardData.backgroundImageScaled[0];
        const backgroundUrl = backgroundImage.url;
        console.log('Background URL:', backgroundUrl);
      } else {
        console.error('Background image URL not found in board data.');
      }
      fetchBoards(workspaceId);
    } catch (error) {
      console.error('Error fetching board data:', error);
    } finally {
      setRefreshing(false);
    }
  };
  

  
  
  useEffect(() => {
    const { workspaceId } = route.params;
    fetchBoards(workspaceId);
  }, []);

  const [deleteButtonVisible, setDeleteButtonVisible] = useState(false);

  const onToggleDeleteButton = () => {
    setDeleteButtonVisible(!deleteButtonVisible);
  };

  const settingsModal = () => {
    setModalVisibleSettings(!isModalVisibleSettings);
  };

  const editModal = () => {
    setModalVisibleEdit(!isModalVisibleEdit);
  };

  const { boardId } = route.params;

  const [boardBackgroundImageUrl, setBoardBackgroundImageUrl] = useState('');

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        setRefreshing(true);
        const { boardId } = route.params;
        const boardData = await getBoard(boardId);
        if (boardData && boardData.backgroundImageScaled && boardData.backgroundImageScaled.length > 0) {
          const backgroundImageUrl = boardData.backgroundImageScaled[0].url;
          setBoardBackgroundImageUrl(backgroundImageUrl);
        } else {
          console.error('Background image URL not found in board data.');
        }
      } catch (error) {
        console.error('Error fetching board data:', error);
      } finally {
        setRefreshing(false);
      }
    };

    fetchBoardData();
  }, []);

  return (
    <View style={currentStyles.container}>
      <View style={currentStyles.header}>
        <Text style={currentStyles.headerTitle}>Choose a Board</Text>
      </View>

      <ScrollView
        contentContainerStyle={currentStyles.boardList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {boards.map((board) => (
          <TouchableOpacity 
            key={board.id} 
            style={currentStyles.boardItem} 
            onPress={() => navigation.navigate('TableScreen', { boardId: board.id })}
          >
            <Text style={currentStyles.boardTitle}>{board.name}</Text>
            <Text style={styles.backgroundImageUrl}>{boardBackgroundImageUrl}</Text>
            {/* <View style={currentStyles.modalButtonRow}> */}
              <TouchableOpacity 
                style={[currentStyles.deleteButton, currentStyles.editButton]} 
                onPress={() => toggleEditModal(board.id)}
              >
                <Text style={currentStyles.deleteButtonText}>Edit</Text>
              </TouchableOpacity>
              {deleteButtonVisible && (
                <TouchableOpacity 
                  style={currentStyles.deleteButton} 
                  onPress={() => deleteBoard(board.id)}
                >
                  <Text style={currentStyles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              )}
            {/* </View> */}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        visible={isModalVisibleEdit}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisibleEdit(false)} // Correction: Utilisation de setModalVisibleEdit pour fermer la modal
      >
        <View style={currentStyles.centeredView}>
          <View style={currentStyles.modalView}>
            <Text style={currentStyles.modalText}>Change board name</Text>
            <TextInput
              style={currentStyles.input}
              value={newBoardName}
              onChangeText={setNewBoardName}
              placeholder="New table name"
            />
            <TouchableOpacity
              style={[currentStyles.modalButton, currentStyles.modalCreateButton]}
              onPress={() => handleSaveChanges(selectedBoardForEdit)} // Appel de la fonction handleSaveChanges avec l'ID du board en argument
            >
              <Text style={currentStyles.modalButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[currentStyles.modalButton, currentStyles.modalCancelButton]} onPress={() => toggleEditModal(selectedBoardForEdit)}>
              <Text style={currentStyles.modalButtonText}>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setModalVisible(!isModalVisible);
        }}
      >
      <View style={currentStyles.centeredView}>
        <View style={currentStyles.modalView}>
          <Text style={currentStyles.modalText}>New board name</Text>
          <TextInput
            style={currentStyles.input}
            onChangeText={(text) => setNewBoardName(text)}
            value={newBoardName}
            placeholder="Name of the table"
          />
          <View style={currentStyles.modalButtonRow}>
            <TouchableOpacity
              onPress={() => setModalVisible(!isModalVisible)}
              style={[currentStyles.modalButton, currentStyles.modalCancelButton]}>
              <Text style={currentStyles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={addNewBoard}
              style={[currentStyles.modalButton, currentStyles.modalCreateButton]}>
              <Text style={currentStyles.modalButtonText}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      </Modal>
      
      <View style={currentStyles.buttonRow}>
      <TouchableOpacity style={[currentStyles.button, currentStyles.createButton]} onPress={() => setModalVisible(true)}>
        <Text style={currentStyles.buttonText}>Create board</Text>
      </TouchableOpacity>


        <TouchableOpacity style={[currentStyles.button, currentStyles.toggleButton]} onPress={onToggleDeleteButton}>
          <Text style={currentStyles.buttonText}>{deleteButtonVisible ? 'Hide Delete' : 'Show Delete'}</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 5,
  },
  menuBurger: {
    marginRight: 20,
  },
  headerTitle: {
    fontSize: 26,
    marginBottom: 0,
    color: '#607058',
    fontWeight: 'bold',
  },
  boardList: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  boardItem: {
    width: '90%',
    backgroundColor:"#eee",
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
  boardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 10,
    color: '#454787',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 30,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalButtonRow: {
    flexDirection: 'row', 
    width: '100%', 
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10, 
    width: 105,
    alignItems: 'center',
  },
  modalCreateButton: {
    backgroundColor: '#004d4d', 
  },
  modalCancelButton: {
    backgroundColor: '#607058', 
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 30,
    padding: 10,
    width: 230,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  createButton: {
    marginTop: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#714587',
    borderRadius: 5,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggleButton: {
    marginTop: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#607058',
    borderRadius: 5,
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: "#8f250c",
    borderRadius: 5,
    padding: 20, 
    width: '100%',
    marginTop: 10,
  },
  deleteButtonText: {
    color: "#ffffff", 
    textAlign: "center",
    fontSize: 14,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor:'#004d4d',
    // width: '14%',
  },
  backgroundImageUrl: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'blue',
    textAlign: 'center',
  },
});


const darkThemeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8c8c8c',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 5,
  },
  menuBurger: {
    marginRight: 20,
  },
  headerTitle: {
    fontSize: 26,
    marginBottom: 0,
    color: '#704241',
    fontWeight: 'bold',
  },
  boardList: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  boardItem: {
    width: '90%',
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
  boardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 10,
    color: '#D3D3D3',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#8c8c8c',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 30,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D3D3D3',
  },
  modalButtonRow: {
    flexDirection: 'row', 
    width: '100%', 
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10, 
    width: 105,
    alignItems: 'center',
  },
  modalCreateButton: {
    backgroundColor: '#344e41', 
  },
  modalCancelButton: {
    backgroundColor: '#704241', 
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    marginBottom: 30,
    padding: 10,
    width: 230,
    borderWidth: 0.4,
    borderRadius: 5,
    backgroundColor: '#737373',
    borderColor: '#404040',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  createButton: {
    marginTop: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#344e41',
    borderRadius: 5,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggleButton: {
    marginTop: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#704241',
    borderRadius: 5,
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: "#4d0000",
    borderRadius: 5,
    padding: 20, 
    width: '100%',
    marginTop: 10,
  },
  deleteButtonText: {
    color: "#ffffff", 
    textAlign: "center",
    fontSize: 16,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor:'#004d4d',
    // marginRight: 100,
    // width: '14%',
  },
});

export default BoardScreen;
