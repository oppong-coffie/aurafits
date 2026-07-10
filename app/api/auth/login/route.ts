import { login } from '@/controllers/authController';

export async function POST(request: Request) {
  return login(request);
}
