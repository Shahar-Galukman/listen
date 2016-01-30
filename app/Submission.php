<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'submissions';


    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'facebook_id',
        'playlist_id'
    ];

    public function Submission(){
        return $this->belongsTo('User', 'facebook_id');
    }
}
