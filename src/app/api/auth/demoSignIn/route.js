import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Forward the request to your backend API
    const response = await fetch(`http://37.27.120.45:5901/api/auth/demoSignIn`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    // Return the response from the backend (whether success or error)
    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    console.error('Demo SignIn API error:', error);
    return NextResponse.json(
      { success: false, message: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}
