import fetch from 'node-fetch';
import { apiKey, apiToken } from '../config';

const fetchUserInfo = async () => {
  try {
    const response = await fetch(`https://api.trello.com/1/members/me?key=${apiKey}&token=${apiToken}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error(`Error fetching user information. Status: ${response.status}, Message: ${await response.text()}`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching user information:', error);
    return null;
  }
};

export default fetchUserInfo;
