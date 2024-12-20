import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PenSquare, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-gray-800">
            AI Blog Platform
          </Link>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/create"
                  className="flex items-center space-x-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  <PenSquare size={20} />
                  <span>New Post</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md text-gray-600 hover:text-gray-900"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}