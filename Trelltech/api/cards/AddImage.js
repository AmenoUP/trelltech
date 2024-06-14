const fetch = require('node-fetch');
const APIKey = 'd26eeb0815ad20a306d0ac9880dbf057';
const APIToken = 'ATTA453651adb73cf392d61ed64663a4f9b2e89ccae734af44ed274b6e9583c66c8d68F3F283';

const uploadUrl = `https://api.trello.com/1/cards/${cardId}/attachments?key=${apiKey}&token=${apiToken}`;

// Remplacez 'CHEMIN_VERS_VOTRE_IMAGE' par le chemin d'accès local ou l'URL de votre image
const imageFilePath = 'CHEMIN_VERS_VOTRE_IMAGE';

// Définissez les options de la requête POST
const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  body: createFormData(imageFilePath),
};

// Fonction pour créer un objet FormData à partir du chemin du fichier
const createFormData = (filePath) => {
  const formData = new FormData();
  formData.append('file', {
    uri: filePath,
    name: 'image.jpg', // Nom du fichier que vous souhaitez envoyer
    type: 'image/jpeg', // Type de fichier
  });
  return formData;
};

// Envoyer la requête POST pour télécharger l'image
fetch(uploadUrl, options)
  .then(response => response.json())
  .then(data => {
    console.log('Image téléchargée avec succès :', data);
  })
  .catch(error => {
    console.error('Erreur lors du téléchargement de l\'image :', error);
  });
