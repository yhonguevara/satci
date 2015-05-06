<?php namespace SATCI\Http\Controllers\Admin;

use SATCI\Entities\User;
use SATCI\Repositories\UserRepo;
use SATCI\Http\Requests;
use SATCI\Http\Controllers\Controller;
use SATCI\Services\Registrar;

use Illuminate\Http\Request;

class UsersController extends Controller {

	protected $userRepo;

	public function __construct(UserRepo $userRepo)
	{
		$this->middleware('auth');
		$this->userRepo = $userRepo;
	}

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		$users = $this->userRepo->getListUsers();
		$num = 0;
		
		return view('admin.users.index', compact('users', 'num'));
	}

	/**
	 * Show the form for creating a new resource.
	 *
	 * @return Response
	 */
	public function create()
	{
		return view('auth.register');
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store(Request $request)
	{
		$user = new User($request->all());
		$user->save();

		return redirect()->route('admin.users.index');
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		//
	}

	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function edit($id)
	{
		//
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
		//
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
