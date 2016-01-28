<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Song extends Model
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
        'video_duration',
        'artist',
        'title',
        'genre',
        'album',
        'track_number',
        'year',
    ];

    /**
     * Change date format due to Firefox javascript Date.parse issue
     * @param $date
     * @return string
     */
    public function getCreatedAtAttribute($date)
    {
        return str_replace('-', '/', $date);
    }

    /**
     * Change date format due to Firefox javascript Date.parse issue
     * @param $date
     * @return string
     */
    public function getUpdatedAtAttribute($date)
    {
        return str_replace('-', '/', $date);
    }
}
