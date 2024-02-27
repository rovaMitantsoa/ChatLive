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
    // Si le clientId existe
    if (!existingClients.includes(clientId)) {
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
        clientList.appendChild(listItem);

        existingClients.push(clientId);
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

// Ajouter des événements sur l'envoi de message...
function createClientChatWindow(clientId) {
    const clientConversation = document.getElementById('clientConversation');
    const selectedClientIdSpan = document.getElementById('selectedClientId');
    selectedClientIdSpan.textContent = clientId;

    // Pour marquer les messages comme lus lorsque le client est sélectionné
    markMessagesAsRead(clientId);

    let clientMessageDiv = document.getElementById(`messageLog-${clientId}`);
    if (!clientMessageDiv) {
        clientMessageDiv = document.createElement('div');
        clientMessageDiv.id = `messageLog-${clientId}`;
        clientMessageDiv.innerHTML = `<h3>Messages du client ${clientId}</h3>`;
        document.body.appendChild(clientMessageDiv);
    }

    // Vérifier si l'input existe déjà
    let adminMessageInput = document.getElementById(`adminMessageInput_${clientId}`);
    if (!adminMessageInput) {
        // Ajouter un champ de saisie pour l'envoi de message au client spécifique
        adminMessageInput = document.createElement('input');
        adminMessageInput.setAttribute('type', 'text');
        adminMessageInput.setAttribute('id', `adminMessageInput_${clientId}`);
        adminMessageInput.setAttribute('placeholder', 'Envoyer un message');
        clientMessageDiv.appendChild(adminMessageInput);

        // Ajouter un bouton pour l'envoi de message au client spécifique
        const sendAdminMessageButton = document.createElement('button');
        sendAdminMessageButton.setAttribute('class', 'sendAdminMessageButton'); 
        sendAdminMessageButton.setAttribute('data-client-id', clientId); 
        sendAdminMessageButton.textContent = 'Envoyer';
        clientMessageDiv.appendChild(sendAdminMessageButton);

        // Ajouter un gestionnaire d'événements pour le bouton d'envoi de message
        sendAdminMessageButton.addEventListener('click', () => {
            const adminMessageInput = document.getElementById(`adminMessageInput_${clientId}`);
            const adminMessage = adminMessageInput.value.trim();
            if (adminMessage) {
                sendMessageToClient(clientId, adminMessage);
                adminMessageInput.value = '';
            }
        });
    }
    clientConversation.style.display = 'block';
}

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
                messageElement.textContent = message.content;
                clientMessageDiv.appendChild(messageElement);
            }
        });
    } else {
        // Si aucun message n'existe pour ce client, affiche un message indiquant qu'aucun message n'est disponible
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

// Afficher le message de l'admin...
function displayAdminMessage(message) {
    const messageLog = document.getElementById('messageLog');
}