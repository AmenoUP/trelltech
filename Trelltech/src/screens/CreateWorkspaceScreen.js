// Import des bibliothèques nécessaires
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { APIKey, APIToken } from '../../api/config';

const CreateWorkspaceScreen = ({ navigation }) => {
  // États pour stocker les informations du nouveau workspace
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');

  // Fonction pour créer un nouveau workspace
  const createWorkspace = async () => {
    try {
      const response = await fetch(
        `https://api.trello.com/1/organizations?displayName=${displayName}&key=${APIKey}&token=${APIToken}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP! Statut: ${response.status}`);
      }

      const data = await response.json();
      console.log('Nouveau workspace créé:', data);

      // Rediriger vers la page du nouveau workspace ou effectuer une autre action
      // Vous pouvez personnaliser cela selon vos besoins
      navigation.navigate('WorkspaceDetails', { workspaceId: data.id });
    } catch (error) {
      console.error('Erreur lors de la création du workspace:', error);
      setError('Erreur lors de la création du workspace. Veuillez réessayer.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create a new workspace</Text>
      <TextInput
        style={styles.input}
        placeholder="Workspace name"
        value={displayName}
        onChangeText={setDisplayName}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button title="Créer le workspace" onPress={createWorkspace} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
  errorText: {
    color: '#9b2226',
    marginBottom: 10,
  },
});

export default CreateWorkspaceScreen;
