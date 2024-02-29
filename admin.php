<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- <link rel="stylesheet" href="./style_admin.css"> -->
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        h2 {
            text-align: center;
            margin-top: 20px;
            color: #fff;
            margin: 0;
            background-color: #2E80DC;
            padding: 20px 20px;
        }
        h3 {
            text-align: center;
            margin-top: 0;
            color: #555;
        }
        .clientList {
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            padding: 20px;
            margin: 20px;
            width: 300px;
            float: left;
            height: 77vh;
        }
        .clientList ul {
            list-style-type: none;
            padding: 0;
        }
        .clientList li {
            cursor: pointer;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
            transition: background-color 0.3s ease;
            text-align: center;
            border-radius: 5px;
        }
        .clientList li:hover {
            background-color: #32BBB3;
        }
        .clientList li.active {
            background-color: #d4eaff;
            border-radius: 7px;
        }
        #clientConversation {
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            padding: 20px;
            width: 65%;
            display: none;
            float: right;
            margin: 20px;
            height: 77vh;
        }
        .messageLog {
            padding: 10px;
            border: 1px solid #eee;
            border-radius: 5px;
            max-height: 400px;
            overflow-y: auto;
            margin: 10px;
            height: 500px;
        }
        .messageLog p {
            margin: 5px 0;
        }
        .clientList li.unread {
            font-weight: bold;
            background-color: #E2A817;
            color: red;
            border-radius: 5px;
        }
        .lisitra {
            overflow-y: auto;
            height: 69vh;
        }
        input[type="text"] {
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 3px;
            font-size: 14px;
            width: 88.5%; 
            margin-bottom: 8px;
            outline: none;
            height: 25px;
        }
        button {
            padding: 10px 15px;
            background-color: #32BBB3;
            color: #fff; 
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 14px;
        }
        button:hover { 
            background-color: #2E80DC;
        }
    </style>
    <title>LiveChat</title>
</head>
<body>
    <h2>Admin ChatLive</h2>
    
    <div class="clientList">
        <h3>Clients connectés </h3>
        <div class="lisitra">
            <ul id="clientList"></ul>
        </div>
    </div>
   
    <!-- Zone de conversation avec le client sélectionné -->
    <div id="clientConversation">
        <h3>Discussion avec le client <span id="selectedClientId"></span></h3>
        <div id="messageLog" class="messageLog"></div> 
            <input type="text" placeholder="Entrez votre message">
            <button>Envoyer</button>
    </div>  
    <script src="./script/admin.js"></script>
</body>
</html>