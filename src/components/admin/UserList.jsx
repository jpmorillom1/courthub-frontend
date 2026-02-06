import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { userService } from '../../services/userService';

export function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await userService.getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <p className="text-gray-500">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Users className="w-6 h-6 text-gray-600" />
        <div>
          <h2 className="text-gray-900">User Management</h2>
          <p className="text-gray-600 mt-1">View all users</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Name</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Faculty</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">User ID</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="3" className="py-12 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 text-sm text-gray-900">{user.name}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{user.faculty || '-'}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {user.id ? user.id.slice(0, 8) : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

