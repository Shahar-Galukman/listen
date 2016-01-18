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

Route::get('auth/facebook', 'Auth\AuthController@redirectToProvider');
Route::get('auth/facebook/callback', array('as' => 'facebookCallback', 'uses' => 'Auth\AuthController@handleProviderCallback'));

Route::get('/', array('as' => 'home', 'uses' => 'SongsController@index'));
Route::get('/playlist', 'SongsController@getPlaylist');

Route::post('/song/add', 'SongsController@store');
Route::post('/change', 'SongsController@changeTrack');
Route::post('/search', 'YoutubeController@queryYoutube');

//TODO: Development purpose only, should be blocked in time
Route::get('/reset', 'SongsController@setUpdatedToToday');