import { apiKey, apiToken } from '../config';

const fetch = require('node-fetch');

export const getBoard = async (boardId) => {
    try {
        const response = await fetch(`https://api.trello.com/1/boards/${boardId}?key=${apiKey}&token=${apiToken}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        console.log(`Response: ${response.status} ${response.statusText}`);

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            return data; // Return the fetched data
        } else {
            throw new Error('Failed to fetch board data');
        }
    } catch (error) {
        console.error(error);
        return null; // Return null if an error occurs
    }
}
