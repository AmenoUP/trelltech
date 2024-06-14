import { apiKey,apiToken } from '../config';
const fetch = require('node-fetch');

const APIKey = apiKey;
const APIToken = apiToken;


const deleteList = (id) => {
    fetch(`https://api.trello.com/1/lists/${id}/closed?key=${APIKey}&token=${APIToken}&value=true`, {
        method: 'PUT'
      })
        .then(response => {
          console.log(
            `Response: ${response.status} ${response.statusText}`
          );
          return response.text();
        })
        .then(text => console.log(text))
        .catch(err => console.error(err));
};

export default deleteList;