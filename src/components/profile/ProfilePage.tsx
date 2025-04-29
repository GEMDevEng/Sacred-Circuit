import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import PageTransition from '../common/PageTransition';
import ProfileForm from './ProfileForm';
import PasswordChangeForm from './PasswordChangeForm';
import Button from '../common/Button';

/**
 * Profile page component
 */
const ProfilePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

  return (
    <PageTransition>
      <section className="py-12 px-4">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl font-serif text-primary-600 mb-4">
                Your Profile
              </h1>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                Manage your account settings and change your password.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Profile Header */}
              <div className="bg-primary-50 p-6 border-b border-primary-100">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 text-xl font-bold">
                    {user?.healingName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h2 className="text-xl font-medium text-neutral-800">
                      {user?.healingName || 'User'}
                    </h2>
                    <p className="text-neutral-600">{user?.email || 'No email'}</p>
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="border-b border-gray-200">
                <nav className="flex">
                  <button
                    className={`px-6 py-4 text-sm font-medium ${
                      activeTab === 'profile'
                        ? 'border-b-2 border-primary-500 text-primary-600'
                        : 'text-neutral-500 hover:text-neutral-700'
                    }`}
                    onClick={() => setActiveTab('profile')}
                  >
                    Profile Information
                  </button>
                  <button
                    className={`px-6 py-4 text-sm font-medium ${
                      activeTab === 'password'
                        ? 'border-b-2 border-primary-500 text-primary-600'
                        : 'text-neutral-500 hover:text-neutral-700'
                    }`}
                    onClick={() => setActiveTab('password')}
                  >
                    Change Password
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'profile' ? (
                  <ProfileForm />
                ) : (
                  <PasswordChangeForm />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default ProfilePage;
