<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePlaylist extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('playlist', function (Blueprint $table) {
            $table->increments('id');
            
            $table->string('video_name');
            $table->string('video_id');
            $table->string('video_duration');

            // Song Meta data
            $table->string('title')->nullable();
            $table->string('artist')->nullable();
            $table->string('genre')->nullable();
            $table->string('album')->nullable();
            $table->string('track_number')->nullable();
            $table->string('year')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('playlist');
    }
}
