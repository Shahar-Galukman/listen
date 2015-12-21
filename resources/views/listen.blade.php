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
    <body class="listener">
        <div class="container">
            <div class="content">
                <div class="title">Music Share</div>
                <!-- Le Youtube player -->
                <div id="player"></div>
                <h1 class="info"><?php echo isset($song) ? 'Loading...' : 'No active broadcast'; ?></h1>
                <h3 class="counter">.</h3>
            </div>
        </div>
        
        <?php if ( isset($song) ) : ?>
            <div id="data" data-songid={{ $song->video_id }} data-time={{ $song->current_time }}></div>
        <?php endif; ?>

        <!-- {{ $playlist }} -->

        <script src="js/vendor/jquery.js"></script>
        <script src="js/vendor/pusher.min.js"></script>
        <script src="js/main.js"></script>
    </body>
</html>
