import { logout } from '@/controllers/authController';

export async function POST() {
  return logout();
}
