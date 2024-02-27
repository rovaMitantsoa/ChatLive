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
            color: #333;
        }
        .clientList {
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            padding: 20px;
            margin-left: 20px;
            width: 300px;
            /* float: left; */
            /* height: 81vh; */
        }
        .clientList h3 {
            margin-top: 0;
            color: #555;
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
            background-color: #f9f9f9;
        }
        .clientList li.active {
            background-color: #d4eaff;
        }
        #clientConversation {
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            padding: 20px;
            margin: 20px auto;
            max-width: 800px;
            display: none;
            overflow: hidden;
        }
        #clientConversation h3 {
            margin-top: 0;
            color: #555;
        }
        .messageLog {
            margin-top: 10px;
            padding: 10px;
            border: 1px solid #eee;
            border-radius: 5px;
            max-height: 400px;
            overflow-y: auto;
            margin: 20px;
        }
        .messageLog p {
            margin: 5px 0;
        }
        .clientList li.unread {
            font-weight: bold;
            background-color: #BBBBBB;
            color: red;
            border-radius: 5px;
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
    <div id="clientConversation" style="display: none;">
        <h3>Discussion avec le client <span id="selectedClientId"></span></h3>
        <div id="messageLog" class="messageLog"></div> 
    </div>  
    
    <script src="./script/admin.js"></script>
</body>
</html>
