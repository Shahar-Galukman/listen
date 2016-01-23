<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ExtendUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function ($table) {
            $table->boolean('new');
            $table->string('longitude');
            $table->string('latitude');
            $table->string('country');
            $table->string('city');
            $table->string('gender');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function ($table) {
            $table->dropColumn('new');
            $table->dropColumn('longitude');
            $table->dropColumn('latitude');
            $table->dropColumn('country');
            $table->dropColumn('city');
            $table->dropColumn('gender');
        });
    }
}
