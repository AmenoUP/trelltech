import fetch from 'node-fetch';
import { apiKey, apiToken } from '../config';

const createWorkspace = async (newWorkspaceName) => {
  try {
    const response = await fetch(`https://api.trello.com/1/organizations?key=${apiKey}&token=${apiToken}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        displayName: newWorkspaceName,
      }),
    });

    if (response.ok) {
      return true; // Indique que la création du nouvel espace de travail s'est bien déroulée
    } else {
      console.error(`Error creating workspace. Status: ${response.status}, Message: ${await response.text()}`);
      return false; // Indique qu'il y a eu une erreur lors de la création de l'espace de travail
    }
  } catch (error) {
    console.error('Error creating workspace:', error);
    return false; // Indique qu'il y a eu une erreur lors de la création de l'espace de travail
  }
};

export default createWorkspace;
