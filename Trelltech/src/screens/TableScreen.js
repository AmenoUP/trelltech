import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  Image,
  ScrollView,
  RefreshControl,
} from 'react-native';
import updateList from '../../api/lists/UpdateLists';
import deleteCard from "../../api/cards/DeleteCards"
import { apiKey, apiToken } from '../../api/config';
import createNewList from '../../api/lists/CreateLists';
import deleteList from '../../api/lists/DeleteLists';
import createNewCard from '../../api/cards/CreateCards';
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import Carousel from 'react-native-snap-carousel';
import { Dimensions } from 'react-native';
import ListItem from '../../api/lists/listItem';
import GetMemberButton from '../components/MembersButton/get_members';
import getMember from '../../api/members/GET_member';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';


const TableScreen = ({ route }) => {
  const { boardId } = route.params;
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddCardModalVisible, setAddCardModalVisible] = useState(false);
  const [cardDetailsModalVisible, setCardDetailsModalVisible] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newCardName, setNewCardName] = useState('');
  const [newCardDescription, setNewCardDescription] = useState('');
  const [selectedListIdForCard, setSelectedListIdForCard] = useState(null);
  const [selectedCardDetails, setSelectedCardDetails] = useState(null);
  const [newDescription, setNewDescription] = useState('');
  const [isEditDescriptionModalVisible, setEditDescriptionModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const windowWidth = Dimensions.get('window').width;
  const { isDarkTheme, toggleTheme } = useTheme();
  const [members, setMembers] = useState([]);

  const navigation = useNavigation();
  const [isMembersModalVisible, setMembersModalVisible] = useState(false);


  const openMembersModal = () => {
    toggleMembersModal();
  };


  // Créez une fonction pour ouvrir la modal des membres
  const toggleMembersModal = () => {
    setMembersModalVisible(!isMembersModalVisible);
  };

  const currentStyles = isDarkTheme ? {...styles, ...darkThemeStyles} : styles;

  const toggleAddCardModal = (listId) => {
    setSelectedListIdForCard(listId);
    setAddCardModalVisible(!isAddCardModalVisible);
  };

  const toggleAddListModal = () => {
    setSelectedListIdForCard(null);
    setAddCardModalVisible(!isAddCardModalVisible);
  };

  const toggleCardDetailsModal = () => {
    setCardDetailsModalVisible(!cardDetailsModalVisible);
  };

  const handleSelectImage = () => {
    const options = {
      title: 'Sélectionner une image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
  
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('L\'utilisateur a annulé la sélection de l\'image');
      } else if (response.error) {
        console.error('Erreur de sélection de l\'image:', response.error);
      } else {
        setSelectedImage(response);
      }
    });
  };

  const showImagePicker = () => {
    const options = {
      title: 'Sélectionner une image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
  
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        // You can handle the selected image here
        const selectedImage = { uri: response.uri };
        // Do something with the selected image
      }
    });
  };

  const [memberId, setMemberId] = useState(null); // Initialiser l'ID du membre à null

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(
          `https://api.trello.com/1/boards/${boardId}/members?key=${apiKey}&token=${apiToken}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const membersData = await response.json();
        setMembers(membersData);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    fetchMembers();
  }, [boardId]);

  const fetchLists = async () => {
    try {
      setRefreshing(true);
      const response = await fetch(
        `https://api.trello.com/1/boards/${boardId}/lists?key=${apiKey}&token=${apiToken}&cards=all`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const listsData = await response.json();
      setLists(listsData);
    } catch (error) {
      console.error('Error fetching lists:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, [boardId]);

  const handleAddList = async () => {
    try {
      await createNewList(boardId, apiKey, apiToken, { name: newListName });
      fetchLists();
      toggleAddCardModal(null);
    } catch (error) {
      console.error('Error creating new list:', error);
    }
  };

  handleDeleteList= async (listId) =>{
    try{
      await deleteList(listId);
      fetchLists();
    }catch (error){
      console.error('Error delete list:', error);
    }
  }

  const handleAddCard = async () => {
    try {
      const cardData = {
        name: newCardName,
        desc: newCardDescription,
        file: selectedImage,
      };
  
      await createNewCard(selectedListIdForCard, apiKey, apiToken, cardData);
      fetchLists();
      toggleAddCardModal(null);
    } catch (error) {
      console.error('Error creating new card:', error);
    } finally {
      setSelectedImage(null);
    }
  };

  const handleCardPress = (card) => {
    setSelectedCardDetails(card);
    setNewCardTitle(card.name);
    setNewDescription(card.desc || '');
    toggleCardDetailsModal();
  };

  const handleDeleteCard = async(id)=>{
    try{
      await deleteCard(id);
      fetchLists();
    }catch (error){
      console.error('Error delete card:', error);
    }
  };

  const handleEditDescription = () => {
    setEditDescriptionModalVisible(true);
  };

  const handleSaveDescription = async () => {
    try {
      await updateCardDescription(selectedCardDetails.id, newDescription, newCardTitle);
      toggleCardDetailsModal();
      setNewDescription('');
    } catch (error) {
      console.error('Error saving description:', error);
    }
    setEditDescriptionModalVisible(false);
  };

  const updateCardDescription = async (cardId, newDescription, newCardName) => {
    try {
      const response = await fetch(
        `https://api.trello.com/1/cards/${cardId}?key=${apiKey}&token=${apiToken}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            desc: newDescription,
            name: newCardName,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      fetchLists();
    } catch (error) {
      console.error('Error updating card description:', error);
      throw error;
    }
  };

  const [isEditListModalVisible, setEditListModalVisible] = useState(false);
  const [selectedListIdForEdit, setSelectedListIdForEdit] = useState(null);


  const toggleEditListModal = async (listId) => {
    console.log('List ID:', listId);
    try {
      setEditListModalVisible(!isEditListModalVisible);
  
      if (!isEditListModalVisible) {
        setSelectedListIdForEdit(listId);
        const list = lists.find(list => list.id === listId);
        setNewListName(list.name); // Définissez le nouveau nom de la liste avec le nom actuel de la liste
      } else {
        await updateList(selectedListIdForEdit, newListName); // Passer le nouveau nom de la liste à la fonction updateList
        fetchLists();
        console.log('List updated successfully');
      }
    } catch (error) {
      console.error('Error updating list:', error);
    }
  };

  const [targetListId, setTargetListId] = useState(lists.length > 0 ? lists[0].id : '');

  const handleMoveCard = async (cardId, targetListId) => {
    if (!cardId || !targetListId) {
      console.log('Aucune liste cible sélectionnée');
      return;
    }
  
    let sourceListId;
    let cardToMove;
    for (const list of lists) {
      const foundCard = list.cards.find(card => card.id === cardId);
      if (foundCard) {
        sourceListId = list.id;
        cardToMove = foundCard;
        break;
      }
    }
  
    if (!sourceListId || !cardToMove) {
      console.log('Carte ou liste source introuvable');
      return;
    }
  
    if (sourceListId === targetListId) {
      console.log('La liste source et cible sont identiques.');
      return;
    }
  
    const newLists = lists.map(list => {
      if (list.id === sourceListId) {
        return {...list, cards: list.cards.filter(card => card.id !== cardId)};
      } else {
        return list;
      }
    });
  
    const updatedLists = newLists.map(list => {
      if (list.id === targetListId) {
        return {...list, cards: [...list.cards, cardToMove]};
      } else {
        return list;
      }
    });
  
    setLists(updatedLists);
  
    console.log(`Carte déplacée de ${sourceListId} vers ${targetListId}`);
    toggleCardDetailsModal(); 
  };
  
  

  return (
    <View style={currentStyles.container}>
      <Text style={currentStyles.header}>Lists</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <Carousel
            data={lists}
            horizontal
            keyExtractor={(list) => list.id}
            renderItem={({ item: list }) => (
              <View style={currentStyles.listItem}>
                <Text style={currentStyles.listTitle}>
                  {selectedListIdForEdit === list.id ? newListName : list.name}
                </Text>
                
                <FlatList
                  data={list.cards}
                  keyExtractor={(card) => card.id}
                  renderItem={({ item: card }) => (
                    <TouchableOpacity
                      style={currentStyles.cardItem}
                      onPress={() => handleCardPress(card)}
                    >
                      <Text style={currentStyles.cardTitle}>{card.name}</Text>
                      <Text style={currentStyles.cardDesc}>{card.desc}</Text>
                      <Text boardId={boardId}  />
                    </TouchableOpacity>
                  )}
                />

                <TouchableOpacity
                  style={currentStyles.addCardButton}
                  onPress={() => toggleAddCardModal(list.id)}
                >
                  <Text style={styles.addCardButtonText}>+ Add Card</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={currentStyles.button}
                  onPress={() => handleDeleteList(list.id)}
                >
                  <Icon name="trash-o" size={20} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={currentStyles.editIcon}
                  onPress={() => toggleEditListModal(list.id)}
                >
                  <Icon name="ellipsis-h" size={20} color="#000" />
                </TouchableOpacity>
              </View>
            )}
            sliderWidth={windowWidth}
            itemWidth={windowWidth - 40}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={fetchLists} />
            }
          />


        <TouchableOpacity style={currentStyles.addButton} onPress={toggleAddListModal}>
          <Text style={currentStyles.addButtonLabel}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={openMembersModal} style={currentStyles.buttonMember}>
            <Text style={styles.buttonText}>See members</Text>
          </TouchableOpacity>
        <TouchableOpacity onPress={openMembersModal} style={styles.button}>
      </TouchableOpacity>

          <Modal
            animationType="slide"
            transparent={true}
            visible={isAddCardModalVisible}
            onRequestClose={() => toggleAddCardModal(null)}
          >
            <View style={currentStyles.modalContainer}>
              <View style={currentStyles.modalContent}>
                {selectedListIdForCard === null ? (
                  <>
                    <Text style={currentStyles.modalTitle}>New list</Text>
                    <TextInput
                      style={currentStyles.input}
                      placeholder="List name"
                      value={newListName}
                      onChangeText={setNewListName}
                    />
                   <View style={currentStyles.buttonContainer}>
                      <TouchableOpacity onPress={() => toggleAddCardModal(null)} style={currentStyles.cancelButton}>
                        <Text style={currentStyles.buttonText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={handleAddList} style={[currentStyles.button, {backgroundColor: '#004d4d'}]}>
                        <Text style={currentStyles.buttonText}>Create list</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={currentStyles.modalTitle}>New card</Text>
                    <TextInput
                      style={currentStyles.input}
                      placeholder="Card name"
                      value={newCardName}
                      onChangeText={setNewCardName}
                    />
                    <TextInput
                      style={currentStyles.input}
                      placeholder="Description"
                      value={newCardDescription}
                      onChangeText={setNewCardDescription}
                    />
                    <View style={currentStyles.buttonContainer}>
                      <TouchableOpacity onPress={() => toggleAddCardModal(null)} style={currentStyles.cancelButton}>
                        <Text style={currentStyles.buttonText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={handleAddCard} style={[currentStyles.button, {backgroundColor: '#004d4d'}]}>
                        <Text style={currentStyles.buttonText}>Add card</Text>
                      </TouchableOpacity>
                    </View>
                    {selectedImage && (
                      <View style={currentStyles.selectedImageContainer}>
                        <Image
                          source={{ uri: selectedImage.uri }}
                          style={currentStyles.selectedImage}
                        />
                        <TouchableOpacity
                          style={currentStyles.removeImageButton}
                          onPress={() => setSelectedImage(null)}
                        >
                          <Text style={currentStyles.removeImageButtonText}>Delete image</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </>
                )}
              </View>
            </View>
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={cardDetailsModalVisible}
            onRequestClose={toggleCardDetailsModal}
          >
            <View style={currentStyles.modalContainer}>
              <View style={currentStyles.modalContent}>
                {selectedCardDetails ? (
                  <>
                    <Text style={currentStyles.modalTitle}>Card details</Text>
                    <TextInput
                      style={currentStyles.input}
                      placeholder="Card name"
                      value={newCardTitle}
                      onChangeText={setNewCardTitle}
                    />
                    <TextInput
                      style={currentStyles.input}
                      placeholder="Description"
                      value={newDescription}
                      onChangeText={setNewDescription}
                      multiline={true}
                    />

                    <View style={currentStyles.buttonContainer}>
                      <TouchableOpacity
                        style={currentStyles.cancelButton}
                        onPress={toggleCardDetailsModal}
                      >
                        <Text style={currentStyles.buttonText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[currentStyles.button, {backgroundColor: '#004d4d'}]}
                        onPress={handleSaveDescription}
                      >
                        <Text style={currentStyles.buttonText}>Save</Text>
                      </TouchableOpacity>
                    <TouchableOpacity
                        style={[currentStyles.button, currentStyles.trashButton]}
                        onPress={() => handleDeleteCard(selectedCardDetails.id)}
                      >
                        <Icon name="trash-o" size={20} color="#fff" />
                    </TouchableOpacity>
                    </View>
                    <TouchableOpacity>
                      <Text>Déplacer l'élément dans une autre liste :  </Text>
                    </TouchableOpacity>
                    <Picker
                      selectedValue={targetListId}
                      onValueChange={(itemValue) => setTargetListId(itemValue)}
                      style={currentStyles.picker}
                    >
                      {lists.map((list) => (
                        <Picker.Item key={list.id} label={list.name} value={list.id} />
                      ))}
                    </Picker>
                    <TouchableOpacity
                      style={[currentStyles.button, {backgroundColor: '#006d6d'}]}
                      onPress={() => handleMoveCard(selectedCardDetails.id, targetListId)}
                    >
                      <Text style={currentStyles.buttonText}>Déplacer l'élément</Text>
                    </TouchableOpacity>

                  </>
                ) : null}
              </View>
            </View>
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={isEditDescriptionModalVisible}
            onRequestClose={() => setEditDescriptionModalVisible(false)}
          >
            <View style={currentStyles.centeredView}>
              <View style={currentStyles.modalView}>
                <Text style={currentStyles.modalTitle}>Edit description</Text>
                <TextInput
                  style={currentStyles.input}
                  placeholder="New description"
                  value={newDescription}
                  onChangeText={setNewDescription}
                  multiline={true}
                />
                <View style={currentStyles.buttonContainer}>
                  <TouchableOpacity
                    style={currentStyles.button}
                    onPress={() => setEditDescriptionModalVisible(false)}
                  >
                    <Text style={currentStyles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={currentStyles.button}
                    onPress={handleSaveDescription}
                  >
                    <Text style={currentStyles.buttonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={isEditListModalVisible}
            onRequestClose={toggleEditListModal}
          >
            <View style={currentStyles.modalContainer}>
              <View style={currentStyles.modalContent}>
                {/* Ajoutez ici le contenu de votre modal d'édition */}
                <Text style={currentStyles.modalTitle}>Edit list</Text>
                <TextInput
                  style={currentStyles.input}
                  placeholder="List name"
                  value={newListName}
                  onChangeText={setNewListName}
                />
                <View style={currentStyles.buttonContainer}>
                  <TouchableOpacity
                    style={[currentStyles.button, {backgroundColor: '#004d4d'}]}
                    onPress={() => toggleEditListModal()}
                  >
                    <Text style={currentStyles.buttonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={currentStyles.cancelButton}
                    onPress={toggleEditListModal}
                  >
                    <Text style={currentStyles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={isMembersModalVisible}
            onRequestClose={toggleMembersModal}
          >
            <View style={currentStyles.modalContainer}>
              <View style={currentStyles.modalContent}>
                <Text style={currentStyles.modalTitle}>Members :</Text>
                <FlatList
                  data={members}
                  keyExtractor={(member) => member.id}
                  renderItem={({ item }) => (
                    <Text style={styles.memberText}>{item.fullName}</Text>
                  )}
                />
                {/* Ajoutez un bouton pour fermer la modal */}
                <TouchableOpacity onPress={toggleMembersModal} style={styles.cancelButton}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
    paddingTop: 15,
    paddingBottom: 5,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 0,
    marginLeft: 30,
    color: '#607058',
  },
  listItem: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    width: Dimensions.get('window').width - 40,
    alignSelf: 'center',
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#454787',
  },
  addCardButton: {
    backgroundColor: '#714587',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'center',
    width: '50%',
  },
  addCardButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardItem: {
    backgroundColor: '#E8E8E8',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderColor: '#D9D9D9',
    borderWidth: 0.6,
  },
  cardTitle: {
    fontSize: 20,
    
  },
  cardDesc:{
    fontSize:15,
    fontStyle: 'italic',
    color:'#676666',
  },
  addButton: {
    backgroundColor: '#004d4d',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  addButtonLabel: {
    color: '#fff',
    fontSize: 24,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
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
    width: '80%',
  },
  modalTitle: {
    marginBottom: 25,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#454787',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
    width: 230,
  },
  cardDetailsText: {
    fontSize: 16,
    marginBottom: 10,
  },
  editDescriptionLink: {
    color: '#007bff',
    fontSize: 16,
    textDecorationLine: 'underline',
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: '#344e41',
    padding: 10,
    borderRadius: 5,
    margin: 0,
    width: '40%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  trashButton: {
    marginTop: 10,
    backgroundColor: 'grey',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    alignSelf: 'center',
  },
  selectedImageContainer: {
    marginTop: 10,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 10,
  },
  removeImageButton: {
    backgroundColor: '#ff4500',
    padding: 10,
    borderRadius: 5,
  },
  removeImageButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  addImageLink: {
    color: '#540b0e',
    fontSize: 16,
    textDecorationLine: 'underline',
    marginTop: 15,
  },
  editIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  // button: {
  //   padding: 5,
  //   borderRadius: 25,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   marginVertical: 10,
  // },
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: '#fff',
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
    width: '80%',
  },
  modalTitle: {
    marginBottom: 25,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  memberText: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonMember: {
    padding: 10,
    borderRadius: 5,
    marginRight: 200,
    marginBottom: 0,
    backgroundColor: '#607058',
    marginLeft: 25,
  },
  closeButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#000', 
    backgroundColor: '#fff', 
    borderColor: '#ccc', 
    borderWidth: 1,
    borderRadius: 5, 
    marginBottom: 20, 
  },
});

const darkThemeStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 5,
    backgroundColor: '#8c8c8c',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 0,
    marginLeft: 30,
    color: '#704241',
    paddingLeft: 5,
  },
  listItem: {
    backgroundColor: '#737373',
    padding: 20,
    borderRadius: 10,
    borderColor: '#404040',
    borderWidth: 0.4,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    // shadowOpacity: 1.25,
    // shadowRadius: 8,
    elevation: 6,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#D3D3D3',
  },
  addCardButton: {
    backgroundColor: '#344e41',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 20, 
    alignSelf: 'center',
    width: '50%', 
  },
  addCardButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardItem: {
    backgroundColor: '#666666',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderColor: '#404040',
    borderWidth: 0.4,
  },
  cardTitle: {
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#4d0000',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  addButtonLabel: {
    color: '#fff',
    fontSize: 24,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
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
    width: '80%',
  },
  modalTitle: {
    marginBottom: 25,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
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
    justifyContent: 'space-around',
    width: '100%', 
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#704241', 
    padding: 10,
    borderRadius: 5,
    margin: 0,
    width: '40%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    // backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonMember: {
    padding: 10,
    borderRadius: 5,
    marginRight: 200,
    marginBottom: 0,
    backgroundColor: '#704241',
    marginLeft: 25,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedImageContainer: {
    marginTop: 10,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 10,
  },
  removeImageButton: {
    backgroundColor: '#ff4500',
    padding: 10,
    borderRadius: 5,
  },
  removeImageButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  addImageLink: {
    color: '#4d0000',
    fontSize: 16,
    textDecorationLine: 'underline',
    marginTop: 5,
    marginBottom: 5,
  },
  editDescriptionLink: {
    color: '#4d0000',
    fontSize: 16,
    textDecorationLine: 'underline',
    marginTop: 5,
    marginBottom: 5,
  },
  picker: {
    height: 50,
    width: '100%',
    color: 'black', 
    borderColor: '#ccc', 
    borderWidth: 1,
    borderRadius: 5, 
    marginBottom: 20, 
  },
});

export default TableScreen;
