import React from 'react';

import Workboard from '../components/WorkBoard/WorkBoard';
import { ProtectedRoute } from '@/components/ProtectedRoute/ProtectedRoute';

export default function Home() {
  
  return (
    <>
    <ProtectedRoute>
      <Workboard />
    </ProtectedRoute>
    </>
  );
}
