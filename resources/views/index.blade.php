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
        <div class="header">
            <div class="">
                @if ( \Auth::check($user) )
                    <div class="float-left user-avatar">
                        <img src="{{ $user->avatar  }}" alt="{{ $user->name  }}">
                    </div>
                    <p class="float-left user-name">{{ $greeting }} {{ explode(' ', $user->name)[0]  }}. </p>

                    @if ( is_null($submission) )
                        <a class="float-left call-to-vote">Make your choice!</a>
                    @endif

                @else
                    <p class="float-left welcome">Your choice, for all to hear</p>
                    <a href="/auth/facebook"><div class="float-left fb-login"></div></a>
                @endif

                <div class="float-right app-name">
                    <h4>Listen</h4>
                </div>
            </div>
        </div>
        <div class="content">
            <div id="player"></div>
            <div id="playlist-container" class="row"></div>

            @if ( is_null($submission) )
                <div id="add-song-wrapper"></div>
            @endif
        </div>



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
