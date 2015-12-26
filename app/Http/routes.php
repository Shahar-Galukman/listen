<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', 'SongsController@index');
Route::get('/playlist', 'SongsController@getPlaylist');

Route::post('/song/add', 'SongsController@store');
Route::post('/change', 'SongsController@changeTrack');

//TODO: Development purpose only, should be blocked in time
Route::get('/set', 'SongsController@setUpdatedToToday');