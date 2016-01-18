<?php
/**
 * Created by PhpStorm.
 * User: user
 * Date: 18/01/2016
 * Time: 21:37
 */

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;

class YoutubeController extends Controller {
//$video = \Youtube::searchAdvanced(array(
//'q' => 'juice',
//'part' => 'snippet',
//'type' => 'video',
//'videoCategoryId' => '#music'
//));
//$video = \Youtube::getVideoInfo('MNyG-xu-7SQ');
//var_dump($video);
    public function queryYoutube(Request $request) {
        $results = null;
        if ( $request->has('query') ) {
            $results = \Youtube::searchAdvanced(array(
                'q' => $request->input('query'),
                'part' => 'snippet',
                'type' => 'video',
                'videoCategoryId' => '#music'
            ));
        }

        return (new Response(json_encode($results)));
    }
}