import { apiKey,apiToken } from '../config';
const fetch = require('node-fetch');

const APIKey = apiKey;
const APIToken = apiToken;

const deleteCard = (id) => {

    fetch(`https://api.trello.com/1/cards/${id}?key=${APIKey}&token=${APIToken}`, {
        method: 'DELETE'
      })
        .then(response => {
          console.log(
            `Response: ${response.status} ${response.statusText}`
          );
          return response.text();
        })
        .then(text => console.log(text))
        .catch(err => console.error(err));
}

export default deleteCard;