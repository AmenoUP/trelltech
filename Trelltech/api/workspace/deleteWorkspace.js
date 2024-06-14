import fetch from 'node-fetch';
import { apiKey, apiToken } from '../config';

const deleteWorkspace = async (workspaceId) => {
  try {
    const response = await fetch(`https://api.trello.com/1/organizations/${workspaceId}?key=${apiKey}&token=${apiToken}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      return true; // Indique que la suppression de l'espace de travail s'est bien déroulée
    } else {
      console.error(`Error deleting workspace. Status: ${response.status}, Message: ${await response.text()}`);
      return false; // Indique qu'il y a eu une erreur lors de la suppression de l'espace de travail
    }
  } catch (error) {
    console.error('Error deleting workspace:', error);
    return false; // Indique qu'il y a eu une erreur lors de la suppression de l'espace de travail
  }
};

export default deleteWorkspace;
