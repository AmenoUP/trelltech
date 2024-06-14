import fetch from 'node-fetch';
import { apiKey, apiToken } from '../config';

const fetchWorkspaces = async () => {
  try {
    const response = await fetch(`https://api.trello.com/1/members/me/organizations?key=${apiKey}&token=${apiToken}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    return [];
  }
};

export default fetchWorkspaces;
