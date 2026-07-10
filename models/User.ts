import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true,
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true, 
    lowercase: true, 
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  passwordHash: { 
    type: String, 
    required: [true, 'Password hash is required'],
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
  },
});

// Next.js hot reloading can compile the model multiple times; this pattern prevents model overwrite errors.
export const User = models.User || model<IUser>('User', UserSchema);
