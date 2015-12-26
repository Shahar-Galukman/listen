<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Playlist;
use Carbon\Carbon;
use Vinkla\Pusher\PusherManager;

class SongsController extends Controller {
    
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
        return view('index');
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
            $id = $data['id'];
            
            $song = new Playlist();
            
            $row = $song->where('video_id', $id)->first();
            
            if ( is_null($row) ){

                // We want to set the updated_at coorsponding to latest added
                // song, so playlist would be consistent.
                $latestSong = new Playlist();
                $latestSong = $latestSong->orderby('updated_at', 'desc')->first();

                $latestSongUpdateDate = Carbon::parse($latestSong->updated_at)->timestamp;
                $latestSongDuration   = $latestSong->video_duration;
                $nextUpdateAtStop     = $latestSongUpdateDate + $latestSongDuration;

                // Add song
                $song->video_id       = $id;
                $song->video_name     = $data['name'];
                $song->video_duration = $data['duration'];
                $song->created_at     = Carbon::now('+2');
                $song->updated_at     = Carbon::createFromTimestamp($nextUpdateAtStop)->toDateTimeString();

                $song->save();

                return (new Response('Created', Response::HTTP_CREATED));
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
        //
    }

    public function getPlaylist(){
        $playlist = new Playlist();

        return \Response::json( $playlist->orderby('updated_at', 'desc')->get() );
    }

    // Notify listeners about track change
    public function changeTrack(Request $request){
        if ( isset($request->id) ){
            $this->pusher->trigger('playlist-channel', 'track-changed', ['id' => $request->id]);
        }
    }
}
