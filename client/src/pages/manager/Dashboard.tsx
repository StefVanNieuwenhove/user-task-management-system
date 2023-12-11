import React from 'react';
import { useAuth } from '../../context';

const Dashboard = () => {
  const { user } = useAuth();
  console.log(user);
  return <div>Dashboard manager</div>;
};

export default Dashboard;
