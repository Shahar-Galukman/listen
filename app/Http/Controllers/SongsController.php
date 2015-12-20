<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\PlayingSong;
use Vinkla\Pusher\PusherManager;

class SongsController extends Controller
{

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
        $song = new PlayingSong();
        $song = $song->fetchLastest();

        if ( is_null( $song ) ) {
            return view('listen');
        }

        return view('listen')->with('song', $song);
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

        if ( $request->has('videoId') ) {
            $songId = $data['videoId'];

            $song = new PlayingSong();
            
            $row = $song->where('song_id', $songId)->first();
            
            if ( is_null($row) ){
                // Song doesn't exist, create it
                $song->song_id = $songId;
                $song->current_time = $data['currentTime'];

                $song->save();

                // Notify listeners about song change
                $this->pusher->trigger('playlist-channel', 'track-changed', ['id' => $songId]);

                return 'created';
            } else {
                // Song record exists, update is required
                return self::update($request, $row->id);
            }
        }

        // Throw an excpetion here
        return 'Invalid videoId provided';
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
        $song = \App\PlayingSong::find($id);
        
        $song->current_time = $request->currentTime;

        $song->save();        

        // Return a 200 here
        return 'updated';
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
}