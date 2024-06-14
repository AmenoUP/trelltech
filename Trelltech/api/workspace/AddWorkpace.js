// This code sample uses the 'node-fetch' library:
// https://www.npmjs.com/package/node-fetch
const fetch = require('node-fetch');
const { APIKey, APIToken } = require('../config');
const displayName = 'New Workspace Test';

fetch(`https://api.trello.com/1/organizations?displayName=${displayName}&key=${APIKey}&token=${APIToken}`, {
  method: 'POST',
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