import fetch from 'node-fetch';
import { apiKey, apiToken } from '../config';

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

    return boardData.id;
  } catch (error) {
    console.error('Erreur lors de la création du tableau:', error);
    throw error;
  }
};

export default createNewBoard;
