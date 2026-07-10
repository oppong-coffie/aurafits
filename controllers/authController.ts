import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { User } from '@/models/User';
import { createSession, deleteSession, getSession } from '@/app/lib/session';
import dbConnect from '@/app/lib/mongodb';

const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').max(50),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(7, 'Phone number must be at least 7 characters long').max(20),
  address: z.string().min(5, 'Address must be at least 5 characters long').max(200),
  password: z.string().min(4, 'Password must be at least 4 characters long'),
});

const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function register(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Validate inputs
    const result = RegisterSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          errors: result.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }
    
    const { name, email, phone, address, password } = result.data;
    
    // Check if email already exists (using Mongoose query)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'An account with this email address already exists.' 
        },
        { status: 409 }
      );
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create user in MongoDB
    const user = await User.create({
      name,
      email,
      phone,
      address,
      passwordHash,
    });
    
    // Create session cookie
    await createSession(user.id);
    
    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration controller error:', error);
    // Handle Mongoose duplicate key error (code 11000)
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'An account with this email address already exists.' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}

export async function login(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Validate inputs
    const result = LoginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          errors: result.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }
    
    const { email, password } = result.data;
    
    // Find user by email (using Mongoose query)
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid email or password.' 
        },
        { status: 401 }
      );
    }
    
    // Verify password hash
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid email or password.' 
        },
        { status: 401 }
      );
    }
    
    // Create session cookie
    await createSession(user.id);
    
    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login controller error:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}

export async function logout() {
  try {
    await deleteSession();
    return NextResponse.json(
      { success: true, message: 'Logged out successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout controller error:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred during logout.' },
      { status: 500 }
    );
  }
}

export async function getMe() {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    // Find user by ID (using Mongoose query)
    const user = await User.findById(session.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fetch session controller error:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
