const socket = new WebSocket('ws://localhost:8080');

let clientMessages = {};

socket.addEventListener('open', (event) => {
    console.log('WebSocket connection ouverte:', event);
});

// Verification du client s'il existe
let existingClients = [];

// Pour les clients connectés
socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    const clientId = data.clientId;

    // Vérifier si le client existe déjà dans la liste
    let existingItem = document.querySelector(`#clientList li[data-client-id="${clientId}"]`);

    if (!existingItem) {
        const clientList = document.getElementById('clientList');
        // Afficher le client avec son ID
        const listItem = document.createElement('li');
        listItem.textContent = `Client ${clientId}`;
        listItem.setAttribute('data-client-id', clientId);
        // Marquer les nouveaux clients comme non lus
        listItem.classList.add('unread'); 
        listItem.addEventListener('click', () => {
            createClientChatWindow(clientId);
            const activeItems = document.querySelectorAll('.clientList li.active');
            activeItems.forEach(item => item.classList.remove('active'));
            listItem.classList.add('active');

            // Marquer les messages comme lus lorsque le client est sélectionné
            markMessagesAsRead(clientId);
        });
        // Insérer le nouvel élément au début de la liste
        clientList.insertBefore(listItem, clientList.firstChild);
    } else {
        // Déplacer l'élément existant vers le début de la liste
        existingItem.parentNode.insertBefore(existingItem, existingItem.parentNode.firstChild);
    }
    // Marquer les messages comme non lus lorsque de nouveaux messages arrivent
    markMessagesAsUnread(clientId);
});

// Pour la creation de Zone de discussion de chaque client
socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    const clientId = data.clientId;
    const messageContent = data.content;
    const messageType = data.type;

    // Stocker temporairement le message dans la structure de données
    if (!clientMessages[clientId]) {
        clientMessages[clientId] = [];
    }
    clientMessages[clientId].push({ type: messageType, content: messageContent });
});

// Fonction pour marquer les messages comme lus
function markMessagesAsRead(clientId) {
    const clientListItem = document.querySelector(`#clientList li[data-client-id="${clientId}"]`);
    clientListItem.classList.remove('unread');
}

// Fonction pour marquer les messages comme non lus
function markMessagesAsUnread(clientId) {
    const clientListItem = document.querySelector(`#clientList li[data-client-id="${clientId}"]`);
    clientListItem.classList.add('unread');
}

socket.addEventListener('close', (event) => {
    console.log('WebSocket connection fermé', event);
});

socket.addEventListener('error', (event) => {
    console.error('WebSocket error', event);
});

// Ajoutez ce code pour afficher la section de conversation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    const clientConversation = document.getElementById('clientConversation');
    clientConversation.style.display = 'block';
});

// Ajoutez un gestionnaire d'événements pour le clic sur un client
document.getElementById('clientList').addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
        const clientId = event.target.getAttribute('data-client-id');
        
        // Marquez les messages du client comme lus
        markMessagesAsRead(clientId);

        // Créez dynamiquement les champs de saisie et les boutons pour la conversation avec ce client spécifique
        const clientConversation = document.getElementById('clientConversation');
        const selectedClientIdSpan = document.getElementById('selectedClientId');
        selectedClientIdSpan.textContent = clientId;

        // Vérifiez d'abord si le bouton d'envoi existe déjà pour ce client spécifique
        const existingSendButton = document.querySelector(`#clientConversation button[data-client-id="${clientId}"]`);
        if (!existingSendButton) {
            // Ajoutez un gestionnaire d'événements pour le bouton d'envoi de message
            sendAdminMessageButton.addEventListener('click', () => {
                const adminMessageInput = document.getElementById(`adminMessageInput_${clientId}`);
                const adminMessage = adminMessageInput.value.trim();
                if (adminMessage) {
                    sendMessageToClient(clientId, adminMessage);
                    adminMessageInput.value = '';
                }
            });
            // Affichez la section de la conversation client
            clientConversation.style.display = 'block';
        }
    }
});

// Sélectionnez les éléments ajoutés
const messageInput = document.querySelector('#clientConversation input[type="text"]');
const sendButton = document.querySelector('#clientConversation button');

// Ajoutez un gestionnaire d'événements pour le clic sur le bouton "Envoyer"
sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
        // Appel de la fonction pour envoyer le message
        sendMessageToClient(selectedClientId.textContent, message);
        // Effacer le champ de saisie après l'envoi du message
        messageInput.value = '';
    }
});

// Ajoutez un gestionnaire d'événements pour la pression de la touche "Entrée" dans le champ de texte
messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const message = messageInput.value.trim();
        if (message) {
            // Appel de la fonction pour envoyer le message
            sendMessageToClient(selectedClientId.textContent, message);
            // Effacer le champ de saisie après l'envoi du message
            messageInput.value = '';
        }
    }
});

// Ajouter un gestionnaire d'événements pour le clic sur un client
document.getElementById('clientList').addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
        const clientId = event.target.getAttribute('data-client-id');
        displayClientMessages(clientId);
    }
});

// Lorsque l'administrateur clique sur un client spécifique
function displayClientMessages(clientId) {
    const clientMessageDiv = document.getElementById('messageLog');
    clientMessageDiv.innerHTML = '';

    // Vérifiez d'abord si des messages existent pour ce client
    if (clientMessages.hasOwnProperty(clientId)) {
        clientMessages[clientId].forEach(message => {
            if (message.type === 'image') {
                // Si le message est une image, créez un élément d'image et ajoutez-le à la zone de conversation
                const imgElement = document.createElement('img');
                imgElement.src = message.content;
                clientMessageDiv.appendChild(imgElement);
            } else {
                // Si le message n'est pas une image, créez un élément de paragraphe et ajoutez-le à la zone de conversation
                const messageElement = document.createElement('p');
                // Afficher le message avec l'ID du client
                messageElement.textContent = `Client ${clientId}: ${message.content}`;
                clientMessageDiv.appendChild(messageElement);
            }
        });
    } else {
        // Si aucun message n'existe pour ce client, affichez un message indiquant qu'aucun message n'est disponible
        const noMessageElement = document.createElement('p');
        noMessageElement.textContent = "Aucun message disponible pour ce client.";
        clientMessageDiv.appendChild(noMessageElement);
    }
}

// Fonction utilitaire pour vérifier si le message est une image base64
function isBase64Image(message) {
    // Vérifier si le message commence par "data:image/" (pour les images base64) 
    // OU s'il se termine par une extension d'image (pour les URL d'images)
    return message.startsWith('data:image/') || /\.(jpg|jpeg|png|gif)$/i.test(message);
}
function insertMessageBeforeInput(messageDiv, inputElement) {
    inputElement.parentNode.insertBefore(messageDiv, inputElement);
}

// Afficher les messages des clients
function sendMessageToClient(clientId, message) {
    const data = {
        toClient: true,
        clientId: clientId,
        content: message
    };
    socket.send(JSON.stringify(data));
    const clientMessageDiv = document.getElementById(`messageLog-${clientId}`);
    if (clientMessageDiv) {
        const newMessageDiv = document.createElement('div');
        newMessageDiv.innerHTML = `<p><strong>Admin:</strong> ${message}</p>`;
        insertMessageBeforeInput(newMessageDiv, document.getElementById(`adminMessageInput_${clientId}`));
    }
}

// Ajouter des évenements sur l'envoie de message...
document.getElementById('sendAdminMessageButton').addEventListener('click', () => {
    const adminMessage = document.getElementById('adminMessageInput').value.trim();
    const selectedClientId = document.getElementById('adminMessageInput').dataset.clientId; // Récupérer l'ID du client à partir de l'attribut data-client-id
    if (adminMessage && selectedClientId) {
        sendMessageToClient(selectedClientId, adminMessage);
        displayAdminMessage(adminMessage);
        document.getElementById('adminMessageInput').value = '';
    }
});

// Fonction pour afficher les messages de l'administrateur
function displayAdminMessage(message) {
    const clientMessageDiv = document.getElementById('messageLog');
    const messageElement = document.createElement('p');
    messageElement.textContent = `Admin: ${message}`;
    clientMessageDiv.appendChild(messageElement);
}

// Ajoutez un gestionnaire d'événements pour le clic sur le bouton d'envoi de message de l'administrateur
document.getElementById('sendAdminMessageButton').addEventListener('click', () => {
    const adminMessage = document.getElementById('adminMessageInput').value.trim();
    const selectedClientId = document.getElementById('selectedClientId').textContent; // Récupérer l'ID du client à partir du span
    if (adminMessage && selectedClientId) {
        // Envoyer le message à ce client spécifique
        sendMessageToClient(selectedClientId, adminMessage);
        // Afficher le message de l'administrateur dans la zone de conversation
        displayAdminMessage(adminMessage);
        // Effacer le champ de saisie après l'envoi du message
        document.getElementById('adminMessageInput').value = '';
    }
});