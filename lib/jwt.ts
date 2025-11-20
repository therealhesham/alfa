import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secret-key-here';

if (!process.env.JWT_SECRET) {
  console.warn('⚠️  WARNING: JWT_SECRET not set in environment variables. Using default secret. This is insecure for production!');
}

export interface JWTPayload {
  userId: string;
  username: string;
  email: string;
  role: string;
}

export function generateToken(payload: JWTPayload): string {
  const secret = process.env.JWT_SECRET || 'your-very-secret-key-here';
  
  console.log('🔑 Generating token...');
  console.log('Payload:', payload);
  console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
  console.log('JWT_SECRET length:', secret.length);
  console.log('JWT_SECRET preview:', secret.substring(0, 10) + '...');
  
  const token = jwt.sign(payload, secret, {
    expiresIn: '7d', // Token expires in 7 days
  });
  
  console.log('✅ Token generated, length:', token.length);
  
  return token;
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const secret = process.env.JWT_SECRET || 'your-very-secret-key-here';
    
    // Always log in development to debug
    console.log('🔍 Verifying token...');
    console.log('Token preview:', token.substring(0, 30) + '...');
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    console.log('JWT_SECRET length:', secret.length);
    console.log('JWT_SECRET preview:', secret.substring(0, 10) + '...');
    
    const decoded = jwt.verify(token, secret) as JWTPayload;
    
    console.log('✅ Token verified successfully');
    console.log('Decoded payload:', decoded);
    
    return decoded;
  } catch (error: any) {
    // Log the error for debugging
    console.error('❌ Token verification failed');
    console.error('Error message:', error.message);
    console.error('Error name:', error.name);
    console.error('JWT_SECRET from env:', !!process.env.JWT_SECRET);
    const secret = process.env.JWT_SECRET || 'your-very-secret-key-here';
    console.error('JWT_SECRET value (first 10 chars):', secret.substring(0, 10));
    console.error('JWT_SECRET length:', secret.length);
    console.error('Token length:', token?.length);
    console.error('Token (first 50 chars):', token?.substring(0, 50));
    return null;
  }
}

export function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

