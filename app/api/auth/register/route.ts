import { register } from '@/controllers/authController';

export async function POST(request: Request) {
  return register(request);
}

