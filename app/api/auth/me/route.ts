import { getMe } from '@/controllers/authController';

export async function GET() {
  return getMe();
}
