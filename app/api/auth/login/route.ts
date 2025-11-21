import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateToken } from '@/lib/jwt';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Find user by username or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email: username }
        ],
        isActive: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Token generated successfully');
      console.log('Token length:', token.length);
      console.log('Token preview:', token.substring(0, 20) + '...');
      console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    }

    // Create response with token
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });

    // Set token in HTTP-only cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    };
    
    response.cookies.set('auth-token', token, cookieOptions);

    if (process.env.NODE_ENV === 'development') {
      console.log('🍪 Setting cookie with options:', {
        ...cookieOptions,
        tokenLength: token.length,
        tokenPreview: token.substring(0, 20) + '...',
      });
      // Verify cookie was set
      const setCookie = response.cookies.get('auth-token');
      console.log('🍪 Cookie verification - set:', !!setCookie, 'value length:', setCookie?.value?.length);
    }

    return response;
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


