<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
  
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'vc_pnome' => 'required|string|max:255',
            'vc_mnome' => 'nullable|string|max:255',
            'vc_unome' => 'required|string|max:255',
            'vc_user_name' => 'required|string|max:255|unique:users',
            'vc_foto_perfil' => 'nullable|string|max:255',
            'vc_foto_perfil_capa' => 'nullable|string|max:255',
            'txt_biografia' => 'nullable|string',
            'dt_nascimento' => 'required|date',
            'vc_genero' => 'required|string|max:50',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = User::create([
            'vc_pnome' => $request->vc_pnome,
            'vc_mnome' => $request->vc_mnome,
            'vc_unome' => $request->vc_unome,
            'vc_user_name' => $request->vc_user_name,
            'vc_foto_perfil' => $request->vc_foto_perfil,
            'vc_foto_perfil_capa' => $request->vc_foto_perfil_capa,
            'txt_biografia' => $request->txt_biografia,
            'dt_nascimento' => $request->dt_nascimento,
            'vc_genero' => $request->vc_genero,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'message' => 'Usuário Registrado com sucesso',
            'user' => $user,
            'token' => $token
        ], 201);
    }

     
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        try {
           
            $user = User::where('email', $credentials['email'])->first();
            
            if (!$user || !Hash::check($credentials['password'], $user->password)) {
                return response()->json(['error' => 'Credenciais inválidas'], 401);
            }

            
            $token = JWTAuth::fromUser($user);

            return response()->json([
                'access_token' => $token,
                'token_type' => 'bearer',
                'expires_in' => config('jwt.ttl') * 60,
                'user' => [
                    'id' => $user->id,
                    'vc_user_name' => $user->vc_user_name,
                    'email' => $user->email,
                ]
            ]);

        } catch (JWTException $e) {
            return response()->json(['error' => 'Não foi possível criar o token'], 500);
        }
    }

 
    public function me()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            return response()->json($user);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Usuário não autenticado'], 401);
        }
    }

    /**
     * Log the user out (Invalidate the token)
     */
    public function logout()
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json(['message' => 'Usuário deslogado com sucesso']);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Não foi possível fazer logout'], 500);
        }
    }

    /**
     * Refresh a token
     */
    public function refresh()
    {
        try {
            $token = JWTAuth::refresh(JWTAuth::getToken());
            return $this->respondWithToken($token);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Não foi possível refresh do token'], 401);
        }
    }

    /**
     * Get the token array structure
     */
  /**
 * Get the token array structure
 */
protected function respondWithToken($token)
{
    $user = JWTAuth::user();
    
    return response()->json([
        'access_token' => $token,
        'token_type' => 'bearer',
        'expires_in' => config('jwt.ttl') * 60,
        'user' => $user ? [
            'id' => $user->id,
            'vc_user_name' => $user->vc_user_name,
            'email' => $user->email,
        ] : null
    ]);
    }
}