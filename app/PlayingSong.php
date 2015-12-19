<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PlayingSong extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'playing_songs';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['song_id', 'current_time'];

    public function fetchLastest(){
        return $this->orderby('updated_at', 'desc')->first();
    }
}
