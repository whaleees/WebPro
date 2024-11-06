<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SearchHistory;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class SearchController extends Controller
{

        // Search for users based on query input
        public function searchUsers(Request $request)
        {
            $query = $request->input('query');
    
            $users = User::where('name', 'LIKE', "%{$query}%")
                         ->orWhere('email', 'LIKE', "%{$query}%")
                         ->get()
                         ->map(function ($user) {
                             return [
                                'id' => $user->id,
                                 'name' => $user->name,
                                 'email' => $user->email,
                                 'profile_image' => $user->profile_image ?? 'default-avatar.png',
                                 'username' => $user->name,
                             ];
                         });
    
            return response()->json($users);
        }
    public function getSearchHistory()
    {
        $userId = Auth::id();
        $history = SearchHistory::where('user_id', $userId)
                                 ->with('searchedUser') // Load searched user details
                                 ->orderBy('created_at', 'desc')
                                 ->take(5) // Limit the history to the latest 5 entries
                                 ->get();

        return response()->json($history);
    }

    public function addSearchHistory(Request $request)
    {
        $userId = Auth::id();
        $searchedUserId = $request->input('searched_user_id');

        $existed = SearchHistory::where('user_id', $userId)->where('searched_user_id', $searchedUserId)->first();

        if($existed) $existed->delete();
        
        SearchHistory::create([
            'user_id' => $userId,
            'searched_user_id' => $searchedUserId,
        ]);

        return response()->json(['success' => true]);
    }

    public function clearSearchHistory()
    {
        $userId = Auth::id();
        SearchHistory::where('user_id', $userId)->delete();

        return response()->json(['success' => true]);
    }

    public function deleteSearchHistoryItem($id)
{
    $userId = Auth::id();
    SearchHistory::where('id', $id)->where('user_id', $userId)->delete();

    return response()->json(['success' => true]);
}

}
