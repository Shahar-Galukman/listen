<!DOCTYPE html>
<html>
    <head>
        <title>Laravel</title>

        <link href="https://fonts.googleapis.com/css?family=Lato:100" rel="stylesheet" type="text/css">

        <style>
            html, body {
                height: 100%;
            }

            body {
                margin: 0;
                padding: 0;
                width: 100%;
                display: table;
                font-weight: 100;
                font-family: 'Lato';
            }

            .container {
                text-align: center;
                display: table-cell;
                vertical-align: middle;
            }

            .content {
                text-align: center;
                display: inline-block;
            }

            .title {
                font-size: 96px;
            }

            .in-pot-er {
                font-weight: bold;
                font-size: 2em;
            }
        </style>
        
        <meta name="csrf-token" content="{{ csrf_token() }}">

    </head>
    <body>
        <div class="container">
            <div class="content">
                <div class="title">Music Share</div>
                <!-- Le Youtube player -->
                <div id="player"></div>
                <h3 class="counter">.</h3>
                
                <div class="in-pot-er">
                    <label for="video-id-value">Youtube video id: </label>
                    <input id="video-id-value" type="text" value="3YR8DCRgmvQ">
                    <input id="video-id-submit" type="submit">
                </div>
            </div>
        </div>

        <script src="js/vendor/jquery.js"></script>
        <script src="js/main.js"></script>
    </body>
</html>
