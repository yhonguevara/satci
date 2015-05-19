<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSolicitudesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('solicitudes', function(Blueprint $table)
		{
			$table->increments('id');
			$table->string('solicitude_number')->unique();
			$table->date('reception_date');
			$table->enum('identification_type', ['Natural', 'Jurídica']);
			$table->integer('applicant_id')->unsigned();
			$table->date('document_date');
			$table->text('topic');
			$table->enum('status', ['Recibido', 'Procesando', 'Aceptado', 'Denegado']);

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
		Schema::drop('solicitudes');
	}

}