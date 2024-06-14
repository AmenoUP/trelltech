const APIKey = 'd26eeb0815ad20a306d0ac9880dbf057';
const APIToken = 'ATTA453651adb73cf392d61ed64663a4f9b2e89ccae734af44ed274b6e9583c66c8d68F3F283';

const deleteNewBoard = async (id) => {
  try {
    const response = await fetch(`https://api.trello.com/1/boards/${id}?key=${APIKey}&token=${APIToken}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const text = await response.text();
    console.log(text);
    return text;
  } catch (err) {
    console.error(err);
    throw err; // Rethrow the error to handle it in the component
  }
};

export { deleteNewBoard };
