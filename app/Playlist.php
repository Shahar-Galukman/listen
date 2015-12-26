<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Playlist extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'playlist';
    
    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'video_name',
        'video_id',
        'artist',
        'title',
        'genre',
        'album',
        'track_number',
        'year',
    ];
}
