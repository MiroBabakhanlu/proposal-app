import React from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from './dashboard/DashboardLayout';

// Import role-specific dashboards
import SpeakerDashboard from './dashboard/Speaker/SpeakerDashboard ';
import ReviewerDashboard from './dashboard/Reviewer/ReviewerDashboard ';
import AdminDashboard from './dashboard/Admin/AdminDashboard ';

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (!user) return null;

  const renderDashboard = () => {
    switch(user.role) {
      case 'SPEAKER':
        return <SpeakerDashboard />;
      case 'REVIEWER':
        return <ReviewerDashboard />;
      case 'ADMIN':
        return <AdminDashboard />;
      default:
        return <div>Unknown role</div>;
    }
  };

  return (
    <DashboardLayout>
      {renderDashboard()}
    </DashboardLayout>
  );
};

export default Dashboard;