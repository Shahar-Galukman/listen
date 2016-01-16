<!DOCTYPE html>
<html>
    <head>
        <title>Listen</title>

        <meta charset="utf-8" />
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="csrf-token" content="{{ csrf_token() }}">
        
        <link href='https://fonts.googleapis.com/css?family=Jura:400,600,500,300' rel='stylesheet' type='text/css'>
        <link rel="stylesheet" href="css/vendor/foundation.min.css" />
        <link rel="stylesheet" href="css/vendor/foundation-icons.css" />
        <link rel="stylesheet" href="css/app.css" />

        <script src="js/vendor/modernizr-2.8.3.min.js"></script>
    </head>
    <body>
    {{ $user  }}
    <img src="" alt="">
        <div class="row columns header"> </div>

        <div id="application" class="row fullwidth"></div>

        <div class="footer"></div>

        <script src="js/vendor/jquery.js"></script>
        <script src="js/vendor/react-0.14.3.js"></script>
        <script src="js/vendor/react-dom-0.14.3.js"></script>
        <script src="js/vendor/browser.min.js"></script>
        <script src="js/vendor/foundation.min.js"></script>
        <script src="js/vendor/what-input.min.js"></script>
        <script src="js/vendor/pusher.min.js"></script>

        <script src="js/app.js"></script>
        
        <script src="js/player.js"></script>
        <script type="text/babel" src="js/playlist.js"></script>
    </body>
</html>
