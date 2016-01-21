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

    /**
     * Inquire Youtube Data API with a song name query
     * @param Request $request
     * @return Response
     */
    public function queryYoutube(Request $request) {
        $results = null;

        if ( $request->has('query') && count($request->input('query')) > 0 ) {
            $config = array(
                'q' => $request->input('query'),
                'part' => 'snippet',
                'type' => 'video',
                'maxResults' => 3,
                'videoEmbeddable' => 'true',
                'videoSyndicated' => 'true',
                'videoCategoryId' => '10' // Music category id
            );

            $results = \Youtube::searchAdvanced( $config );
        }

        return (new Response( json_encode($results) ));
    }

    /**
     * Get Youtube video info by video id
     * @param Request $request
     * @return Response
     */
    public function queryYoutubeVideo(Request $request){
        $video = null;

        if ( $request->has('id') ) {
            $video = \Youtube::getVideoInfo( $request->input('id') );
        }

        return (new Response( json_encode($video) ));
    }
}