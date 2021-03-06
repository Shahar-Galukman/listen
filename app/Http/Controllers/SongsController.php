<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;

use App\Http\Requests;
use App\Song;
use App\Submission;
use Carbon\Carbon;
use Vinkla\Pusher\PusherManager;

class SongsController extends Controller {

    const MY_FACEBOOK_ID = '10153842682654513';

    /**
    * @var PusherManager
    */
    protected $pusher;

    public function __construct(PusherManager $pusher) {
        $this->pusher = $pusher;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $greet = '';
        $submission = null;

        if (\Auth::check()) {
            $user = \Auth::user();
            $greet = $this->setGreeting($user);
            $submission = Submission::where('facebook_id', $user->facebook_id)->first() != self::MY_FACEBOOK_ID;
        } else {
            $user = \Auth::guest();
        }

        return view('index')
            ->with('user', $user)
            ->with('greeting', $greet)
            ->with('submission', $submission);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = $request->all();

        if ( ! empty($data) && isset($data['id']) ) {
            $videoId = $data['id'];
            
            $song = new Song();
            
            $row = $song->where('video_id', $videoId)->first();
            
            if ( is_null($row) ){
                $submission = new Submission();
                $user = \Auth::user();
                $latestSong = new Song();

                $latestSong = $latestSong->orderby('updated_at', 'desc')->first();

                // Add song
                $song->video_id       = $videoId;
                $song->video_name     = $data['name'];
                $song->video_duration = $data['duration'];
                $song->created_at     = Carbon::now()->addHours(2);
                
                if ( is_null($latestSong) ) {
                    $song->updated_at = $song->created_at;
                } else {
                    // We want to set the updated_at coorsponding to latest added
                    // song duration, for a consistent playlist.
                    $latestSongUpdateDate = Carbon::parse($latestSong->updated_at)->timestamp;
                    $latestSongDuration   = $latestSong->video_duration;
                    $nextUpdateAtStop     = $latestSongUpdateDate + $latestSongDuration;
                    
                    $song->updated_at     = Carbon::createFromTimestamp($nextUpdateAtStop)->toDateTimeString();
                }

                $song->save();

                $submission->facebook_id = $user->facebook_id;
                $submission->playlist_id = $song->video_id;

                $submission->save();

                // Publish song added
                $this->pusher->trigger('playlist-channel', 'song-added', []);

                return (new Response( json_encode($song), Response::HTTP_CREATED ));
            } else {
                // Song record already exists
                return (new Response('Conflict', Response::HTTP_CONFLICT));
            }
        }

        // Request data not supported
        return (new Response('Unprocessable Entity', Response::HTTP_UNPROCESSABLE_ENTITY));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $song = Song::find($id);
        $song->delete();

        return $this->index();
    }

    public function getPlaylist(){
        $playlist = new Song();

        return \Response::json( $playlist->orderby('updated_at', 'asc')->get() );
    }

    //TODO: Development purpose only, should be made private in time
    public function setUpdatedToToday(){
        $song = new Song();
        
        $sortedPlaylist = $song->orderby('updated_at', 'asc')->get();
        $previousSongsDuration   = 0;
        $now = Carbon::now('UTC')->addHours(2);

        foreach ($sortedPlaylist as $key => &$value) {
            $key = intval(json_encode($key));
            if ( $key === 0 ) {
                $value->updated_at = $now;
            } else {
                $previousSongsDuration += $sortedPlaylist[$key - 1]->video_duration;
            }

            $nextUpdateAtStop  = $now->timestamp + $previousSongsDuration;
            $value->updated_at = Carbon::createFromTimestamp($nextUpdateAtStop)->toDateTimeString();

            $value->save();
        }

        return \Response::json($sortedPlaylist);
    }

    // Notify listeners about track change
    public function changeTrack(Request $request){
        if ( isset($request->id) ){
            $this->pusher->trigger('playlist-channel', 'track-changed', ['id' => $request->id]);
        }
    }

    private function setGreeting($user) {
        if ( $user->new ) {
            $user->new = false;
            $user->save();

            return "Welcome";
        }

        return "Welcome back";
    }
}
