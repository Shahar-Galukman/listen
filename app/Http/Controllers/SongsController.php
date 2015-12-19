<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\PlayingSong;

class SongsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $song = \App\PlayingSong::find(1);

        if ( is_null( $song ) ) {
            return 'No songs being broadcast at the moment';
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
