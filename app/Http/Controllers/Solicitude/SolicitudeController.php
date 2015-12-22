<?php 
namespace SATCI\Http\Controllers\Solicitude;

use Log;
use Uuid;

use Illuminate\Http\Request;
use Illuminate\Database\QueryException;
// use Illuminate\Routing\Route;

use SATCI\Repositories\SolicitudeRepo;
use SATCI\Http\Requests\CreateSolicitudeRequest;
use SATCI\Http\Requests\EditSolicitudeRequest;
use SATCI\Http\Controllers\Controller;
use SATCI\Utils\Helpers;

class SolicitudeController extends Controller {

	protected $solicitudeRepo;
	// protected $citizenRepo;

	public function __construct(SolicitudeRepo $solicitudeRepo)
	{
		// $this->middleware('jwt.auth');
		$this->solicitudeRepo = $solicitudeRepo;
		// $this->beforeFilter('@findSolicitude', ['only' => ['show', 'edit', 'update', 'destroy']]);
	}

/*	public function findSolicitude(Route $route)
	{
		$this->solicitude = Solicitude::findOrFail($route->getParameter('solicitude'));
	}*/
	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		$solicitudes = $this->solicitudeRepo->getListSolicitudes();

		Helpers::concatApplicantsWithParish($solicitudes);

		return response()->json([
			'solicitudes' => $solicitudes
			], 200
		);
	}

	public function listByApplicant($type)
	{
		$type = ucwords($type);
		if ( $type === 'Citizen' || $type === 'Institution' )
		{
			Helpers::longApplicant($type);

			$solicitudes = $this->solicitudeRepo->getListByApplicant($type);

			// Helpers::concatApplicantsWithParish($solicitudes);

			return response()->json($solicitudes, 200);
		}
		else
		{
			return response()->json('Solicitante Inválido', 404);
		}
	}
	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store(CreateSolicitudeRequest $request)
	{
		$count_solicitude = $this->solicitudeRepo->countSolicitude();

		$solicitude_number = Helpers::getSolicitudeNumber($count_solicitude);

		$request['solicitude_number'] = $solicitude_number;

		$type = $request->applicant_type;

		Helpers::longApplicant($type);

		$request['applicant_type'] = $type;

		$uuid = Uuid::generate(5, 'SATCI', Uuid::generate());
		
		$request['id'] = $uuid->string;

		$solicitude = $this->solicitudeRepo->newSolicitude($request->all());

		return response()->json([
			'success' => true,
			'solicitude' => $solicitude,
			]);
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		$solicitude = $this->solicitudeRepo->getSolicitude($id);
		
		// Helpers::concatSolicitudeWithApplicant($solicitude);

		$type = $solicitude->applicant_type;

    Helpers::shortApplicant($type);

		$solicitude->applicant_type = $type;

		Helpers::concatApplicantWithParish($solicitude->applicant);

		return response()->json([
			'success' => true,
			'solicitude' => $solicitude,
			]);
	}

	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
/*	public function edit($id)
	{
		//
	}*/

	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id, EditSolicitudeRequest $request)
	{
		try 
    {
      $this->solicitudeRepo->update($id, $request->all());
    }
    catch (QueryException $e)
    {
      Log::info($e->errorInfo[2]);
      return response()->json(['error' => true], 200);
    }

		return response()->json(['success' => true]);
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		//
	}

}
