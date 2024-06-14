import { apiKey,apiToken } from '../config';
const fetch = require('node-fetch');

const APIKey = apiKey;
const APIToken = apiToken;

const updateList = async (id, newListName) => {
    try {
      const response = await fetch(
        (`https://api.trello.com/1/lists/${id}?key=${APIKey}&token=${APIToken}`),
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newListName,
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Vous pouvez retourner les données mises à jour de la liste si nécessaire
      const updatedList = await response.json();
      return updatedList;
    } catch (error) {
      console.error('Error updating list:', error);
      throw error;
    }
  };
  

export default updateList;