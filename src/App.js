import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignIn, SignUp, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import ContentGenerator from './components/ContentGenerator';
import './index.css';

// Clerk publishable key
const clerkPublishableKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

// Protected route wrapper
function ProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut><RedirectToSignIn /></SignedOut>
    </>
  );
}

function App() {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey} afterSignOutUrl="/">
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sign-in/*" element={
              <div className="flex items-center justify-center min-h-screen">
                <SignIn routing="path" path="/sign-in" afterSignInUrl="/dashboard" />
              </div>
            } />
            <Route path="/sign-up/*" element={
              <div className="flex items-center justify-center min-h-screen">
                <SignUp routing="path" path="/sign-up" afterSignUpUrl="/dashboard" />
              </div>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/content/:templateSlug" element={
              <ProtectedRoute><ContentGenerator /></ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </ClerkProvider>
  );
}

export default App;
