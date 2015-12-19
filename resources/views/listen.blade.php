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

            #player {
                display: none;
            }
        </style>
        
        <meta name="csrf-token" content="{{ csrf_token() }}">

    </head>
    <body class="listener" data-songid=<?php echo $song->song_id; ?> data-time=<?php echo $song->current_time; ?>>
        <div class="container">
            <div class="content">
                <div class="title">Music Share</div>
                <h3>By Shahar and Yuval</h3>
                <!-- Le Youtube player -->
                <div id="player"></div>
                <h1 class="info">...</h1>
            </div>
        </div>

        <script src="../resources/assets/js/vendor/jquery.js"></script>
        <script src="../resources/assets/js/main.js"></script>
    </body>
</html>
