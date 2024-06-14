import { apiKey, apiToken } from '../config';
const fetch = require('node-fetch');

const APIKey = apiKey;
const APIToken = apiToken;

const getMember = async () => {
    fetch(`https://api.trello.com/1/boards/${boardId}/members?key=${apiKey}&token=${apiToken}`, {
        method: 'GET'
      })
        .then(response => {
          console.log(
            `Response: ${response.status} ${response.statusText}`
          );
          return response.json(); // Parse the JSON response
        })
        .then(data => console.log(data)) // Log the members data
        .catch(err => console.error(err));
    };

export default getMember;
