import { apiKey,apiToken } from '../config';

const fetch = require('node-fetch');

const getBoardBg = async(boardId) => {
    fetch(`https://api.trello.com/1/boards/${boardId}?key=${apiKey}&token=${apiToken}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        console.log(
          `Response: ${response.status} ${response.statusText}`
        );
        return response.json();
      })
      .then(data => {
        const backgroundImageUrl = data.backgroundImageScaled[0].url;
        console.log('Background Image URL:', backgroundImageUrl);
      })
      .catch(err => console.error(err));
};

export default getBoardBg;
