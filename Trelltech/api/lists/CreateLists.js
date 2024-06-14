// create a new list
const fetch = require('node-fetch');

const APIKey = 'd26eeb0815ad20a306d0ac9880dbf057';
const APIToken = 'ATTA453651adb73cf392d61ed64663a4f9b2e89ccae734af44ed274b6e9583c66c8d68F3F283';

const createNewList = async (boardId, APIKey, APIToken, listInfo) => {
    try {
      const response = await fetch(`https://api.trello.com/1/lists?idBoard=${boardId}&key=${APIKey}&token=${APIToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listInfo),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const newList = await response.json();
      console.log('New list created:', newList);
    } catch (error) {
      console.error('Error creating new list:', error);
      throw error;
    }
  };
  
  export default createNewList;
  