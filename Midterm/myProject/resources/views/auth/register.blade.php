<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register</title>
    <link rel="stylesheet" href="{{ asset('css/register.css') }}">
</head>
<body>
    <div class="container">
        <h1>Register</h1>

        @if ($errors->any())
            <div class="errors">
                <ul>
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form method="post" action="{{ route('register') }}">
            @csrf
            <label for="name">Name</label>
            <input type="text" name="name" placeholder="Your Name" required>
            
            <label for="email">Email</label>
            <input type="email" name="email" placeholder="Your Email" required>
            
            <label for="password">Password</label>
            <input type="password" name="password" placeholder="Your Password" required>
            
            <label for="password_confirmation">Confirm Password</label>
            <input type="password" name="password_confirmation" placeholder="Confirm Password" required>
            
            <button type="submit">Register</button>
        </form>
        
        <!-- Optional: Link to login page if already registered -->
        <p>
            Already have an account? <a href="{{ route('login') }}">Log in</a>
        </p>
    </div>
</body>
</html>
