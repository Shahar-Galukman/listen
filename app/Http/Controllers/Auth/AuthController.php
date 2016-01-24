<?php

namespace App\Http\Controllers\Auth;

use App\User;
use Auth;
use Mockery\CountValidator\Exception;
use Psy\Util\Json;
use Socialite;
use App\Http\Controllers\Controller;

class AuthController extends Controller
{

    /**
     * Redirect the user to the Facebook authentication page.
     *
     * @return Response
     */
    public function redirectToProvider()
    {
        return Socialite::driver('facebook')->redirect();
    }

    /**
     * Obtain the user information from Facebook.
     *
     * @return Response
     */
    public function handleProviderCallback()
    {
        try {
            $user = Socialite::driver('facebook')->user();
        } catch (Exception $e) {
            return redirect('auth/facebook');
        }

        $authUser = $this->findOrCreateUser($user);

        Auth::login($authUser, true);

        return redirect()->route('home');
    }

    /**
     * Return user if exists; create and return if doesn't
     *
     * @param $facebookUser
     * @return User
     */
    private function findOrCreateUser($facebookUser)
    {
        $authUser = User::where('facebook_id', $facebookUser->id)->first();

        if ($authUser){
            return $authUser;
        }

        $userGeo = $this->getSubmitterGeoLocation();

        return User::create([
            'name' => $facebookUser->name,
            'email' => $facebookUser->email,
            'facebook_id' => $facebookUser->id,
            'avatar' => $facebookUser->avatar,
            'new' => true,
            'longitude' => $userGeo['longitude'],
            'latitude' => $userGeo['latitude'],
            'country' => $userGeo['countryName'],
            'city' => $userGeo['cityName']
        ]);
    }

    /**
     * Retrieves, via ipinfodb.com, user get location using IP
     * @return json
     */
    private function getSubmitterGeoLocation() {
        $url  = 'http://api.ipinfodb.com/v3/ip-city/?';
        $url .= 'key=' . env('IP_INFO_DB_KEY');
        $url .= '&ip=' . $_SERVER['REMOTE_ADDR'];
        $url .= '&format=json';

        $response = \Curl::to($url)->get();

        return json_decode($response, true);
    }

}
