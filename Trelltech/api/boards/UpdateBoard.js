import { apiKey, apiToken } from '../config';
const fetch = require('node-fetch');

const APIKey = apiKey;
const APIToken = apiToken;

const updateBoard = async (id, newName) => {
  try {
    const response = await fetch(`https://api.trello.com/1/boards/${id}?key=${APIKey}&token=${APIToken}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: newName }) // Nouveau nom du tableau à mettre à jour
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const updatedBoard = await response.json();
    console.log('Updated board:', updatedBoard);
    return true; // Indiquer que la mise à jour a réussi
  } catch (error) {
    console.error('Error updating board:', error);
    return false; // Indiquer que la mise à jour a échoué
  }
};

export default updateBoard;
