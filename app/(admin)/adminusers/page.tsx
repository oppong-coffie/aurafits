import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getSession } from '../../lib/session';
import { User } from '@/models/User';
import dbConnect from '../../lib/mongodb';
import { 
  Users, 
  Trash2, 
  ShieldAlert, 
  UserCheck 
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface SerializedUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

// Server Action to delete a user from MongoDB
async function deleteUserAction(formData: FormData) {
  'use server';
  const userIdToDelete = formData.get('userId') as string;
  
  try {
    const session = await getSession();
    const currentUserId = session?.userId || "mock-admin";

    // Protect against self-deletion
    if (currentUserId === userIdToDelete) {
      console.warn("Self-deletion blocked.");
      return;
    }

    await dbConnect();
    await User.findByIdAndDelete(userIdToDelete);
    
    // Trigger server-side refresh
    revalidatePath('/users');
  } catch (error) {
    console.error("Failed to delete user in admin users panel:", error);
  }
}

export default async function AdminUsersPage() {
  let activeUserId = "mock-admin";
  let allUsers: SerializedUser[] = [];

  try {
    const session = await getSession();
    if (session && session.userId) {
      activeUserId = session.userId;
    }

    await dbConnect();
    // Retrieve all users in reverse order of joining
    const usersList = await User.find().sort({ createdAt: -1 });
    allUsers = usersList.map((u) => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      createdAt: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A',
    }));

  } catch (error) {
    console.error('Error loading admin users page:', error);
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-zinc-200/60 dark:border-zinc-800/60 pb-5">
        <div className="flex items-center gap-3">
          <div className="bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/60 p-2 rounded-2xl text-violet-650 dark:text-violet-400">
            <Users size={24} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">Registered Users</h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Manage user credentials and inspect active database profiles.</p>
          </div>
        </div>
      </div>

      {/* Users Table Card */}
      <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 rounded-3xl overflow-hidden shadow-sm backdrop-blur-sm transition duration-200">
        
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/20">
          <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            System Accounts ({allUsers.length})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest bg-zinc-50/20 dark:bg-zinc-900/10">
                <th className="px-6 py-3.5">User</th>
                <th className="px-6 py-3.5">Reference ID</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5">Joined Date</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850 text-sm">
              {allUsers.map((usr) => {
                const isCurrent = activeUserId === usr.id;
                return (
                  <tr key={usr.id} className="hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-300 flex items-center justify-center font-bold text-xs uppercase shadow-inner">
                          {usr.name ? usr.name.charAt(0) : 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-zinc-900 dark:text-zinc-100">{usr.name}</p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{usr.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-zinc-600 dark:text-zinc-400">
                      {usr.id}
                    </td>
                    <td className="px-6 py-4">
                      {isCurrent ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/60 px-2 py-0.5 rounded-lg shadow-sm">
                          <UserCheck size={12} />
                          Owner (Admin)
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                          Member
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                      {usr.createdAt}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isCurrent ? (
                        <span className="text-[10px] text-zinc-400 font-semibold italic">
                          Cannot Delete Active Session
                        </span>
                      ) : (
                        <form action={deleteUserAction} className="inline-block">
                          <input type="hidden" name="userId" value={usr.id} />
                          <button
                            type="submit"
                            className="text-rose-600 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-350 hover:bg-rose-50 dark:hover:bg-rose-950/20 font-semibold px-3 py-1.5 rounded-lg text-xs transition duration-150 cursor-pointer flex items-center gap-1.5 ml-auto border border-transparent hover:border-rose-200 dark:hover:border-rose-900/60 shadow-sm"
                          >
                            <Trash2 size={12} />
                            Delete Account
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {allUsers.length === 0 && (
          <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">
            <ShieldAlert className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
            <p className="text-xs">No registered system accounts available.</p>
          </div>
        )}
      </div>

    </main>
  );
}
