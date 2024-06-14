
// Create a new card
const fetch = require('node-fetch');



const APIKey = 'd26eeb0815ad20a306d0ac9880dbf057';
const APIToken = 'ATTA453651adb73cf392d61ed64663a4f9b2e89ccae734af44ed274b6e9583c66c8d68F3F283';

const idList = '65dc9649c57c2256cf229e84';


// Get a card

fetch(`https://api.trello.com/1/cards/{id}?key=${APIKey}&token=${APIToken}`, {
  method: 'GET',
  headers: {
    'Accept': 'application/json'
  }
})
  .then(response => {
    console.log(
      `Response: ${response.status} ${response.statusText}`
    );
    return response.text();
  })
  .then(text => console.log(text))
  .catch(err => console.error(err));


// Update a card

fetch(`https://api.trello.com/1/cards/{id}?key=${APIKey}&token=${APIToken}`, {
  method: 'PUT',
  headers: {
    'Accept': 'application/json'
  }
})
  .then(response => {
    console.log(
      `Response: ${response.status} ${response.statusText}`
    );
    return response.text();
  })
  .then(text => console.log(text))
  .catch(err => console.error(err));