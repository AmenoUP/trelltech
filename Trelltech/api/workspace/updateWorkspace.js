import fetch from 'node-fetch';
import { apiKey, apiToken } from '../config';

const updateWorkspace = async (workspaceId, newWorkspaceName) => {
    try {
      const response = await fetch(`https://api.trello.com/1/organizations/${workspaceId}?key=${apiKey}&token=${apiToken}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          displayName: newWorkspaceName,
        }),
      });
  
      if (response.ok) {
        return true; // Indique que la mise à jour de l'espace de travail s'est bien déroulée
      } else {
        console.error(`Error updating workspace. Status: ${response.status}, Message: ${await response.text()}`);
        return false; // Indique qu'il y a eu une erreur lors de la mise à jour de l'espace de travail
      }
    } catch (error) {
      console.error('Error updating workspace:', error);
      return false; // Indique qu'il y a eu une erreur lors de la mise à jour de l'espace de travail
    }
  };
  

export default updateWorkspace;
