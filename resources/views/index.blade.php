<!DOCTYPE html>
<html>
    <head>
        @include('partials/head')
    </head>
    <body>
        {{-- Le Main navigation/header --}}
        @include('partials.nav')

        {{-- Le Add song form --}}
        @include('partials/submissionForm')

        {{-- Le Youtube player placeholder --}}
        <div id="player"></div>

        {{-- Le Main content view --}}
        @include('partials/content')

        {{-- Le Footer --}}
        @include('partials/footer')

        {{-- Le Scripts --}}
        @include('partials/scripts')
    </body>
</html>
