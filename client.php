<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- <link rel="stylesheet" href="./style/style_client.css"> -->
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 400px;
            margin: 0 auto;
            padding: 20px;
        }
        .input-container {
            display: flex;
            align-items: center;
        }
        .chat-header {
            background-color: #075e54;
            color: #fff;
            padding: 10px 20px;
            text-align: center;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
        }
        .message-log {
            overflow-y: auto;
            height: 400px;
            border: 1px solid #ddd;
            padding: 10px;
            background-color: #f5f5f5;
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
        }
        .message {
            margin-bottom: 10px;
            padding: 8px 10px;
            border-radius: 10px;
        }
        .admin-message {
            background-color: #dcf8c6;
        }
        .user-message {
            background-color: #fff;
        }
        .input-container {
            margin-top: 20px;
        }
        .input-container input[type="text"] {
            width: 500px;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 5px;
            margin-right: 10px;
            outline: none;
        }
        #imageInputLabel {
            display: inline-block;
            cursor: pointer;
        }
        #imageInputLabel img {
            width: 35px;
            height: 35px;
            vertical-align: middle;
            margin-left: 10px;
        }
        #sendMessageButton {
            border: none;
            background: none;
            cursor: pointer;
        }
        #sendMessageButton img {
            width: 28px;
            height: 28px;
            margin-left: 10px;
        }
    </style>
    <title>LiveChat</title>
</head>
<body>
<div class="container">
        <div class="chat-header">
            <h1>Chat en temps réel</h1>
        </div>
        <div class="message-log" id="messageLog">
            <!-- Les messages seront ajoutés ici -->
        </div>
        <div class="input-container">
            <input type="text" id="messageInput" placeholder="Entrez votre message...">
            <label for="imageInput" id="imageInputLabel">
                <img src="./image/ajouter-une-image.png" alt="Insérer une image">
                <input type="file" id="imageInput" style="display: none;">
            </label>
            <button id="sendMessageButton">
                <img src="./image/envoyer-le-message.png" alt="Envoyer">
            </button>
            </div>
        </div>
    <script src="./script/client.js"></script>
</body>
</html>
