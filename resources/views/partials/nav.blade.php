<div class="header">
    <div class="small-12 medium-12 large-12 columns">
        @if ( \Auth::check($user) )
            {{--<div class="float-left user-avatar">--}}
            {{--<img src="{{ $user->avatar  }}" alt="{{ $user->name  }}">--}}
            {{--</div>--}}
            <div class="float-left user-wrap">
                <p class="user-name">{{ $greeting }} {{ explode(' ', $user->name)[0]  }}. </p>

                @if ( is_null($submission) )
                    <a class="call-to-vote">Make your choice!</a>
                @endif
            </div>

        @else
            <p class="float-left welcome">Your choice, for all to hear</p>
            <a href="/auth/facebook"><div class="float-left fb-login"></div></a>
        @endif

        <div class="float-right app-name">
            <h1>Listen</h1>
        </div>
    </div>
</div>