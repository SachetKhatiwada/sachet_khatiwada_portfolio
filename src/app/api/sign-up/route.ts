import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  await dbConnect();

  try {
    // Parse the JSON body from the request
    const { username, email, password } = await request.json();

    // Basic validation (ensure required fields are present)
    if (!username || !email || !password) {
      return Response.json(
        {
          success: false,
          message: 'Username, email, and password are required.',
        },
        { status: 400 }
      );
    }

    // Check if the username or email already exists
    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return Response.json(
        {
          success: false,
          message: 'Username or email already exists.',
        },
        { status: 400 }
      );
    }

    // Hash the user's password with 10 salt rounds
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    return Response.json(
      {
        success: true,
        message: 'User registered successfully. Please verify your account.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    return Response.json(
      {
        success: false,
        message: 'Error registering user. Please try again later.',
      },
      { status: 500 }
    );
  }
}
