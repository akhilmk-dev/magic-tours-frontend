import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Outbound from './pages/Outbound'; // Packages list
import PackageDetails from './pages/PackageDetails';
import VisaApplication from './pages/VisaApplication';
import Corporate from './pages/Corporate';
import VendorPackages from './pages/VendorPackages';
import Profile from './pages/Profile';
import Cruise from './pages/Cruise';
import Hotels from './pages/Hotels';
import Tours from './pages/Tours';
import PrivateJets from './pages/PrivateJets';
import Sports from './pages/Sports';
import ContactUs from './pages/ContactUs';

import { CustomerAuthProvider, ProtectedRoute } from './context/CustomerAuthContext';
import { ToastProvider } from './context/ToastContext';
import ChatWidget from './components/Chat/ChatWidget';

// Scroll to top component
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <Router>
      <ToastProvider>
        <CustomerAuthProvider>
          <ScrollToTop />
          <div className="font-sans text-slate-900 antialiased min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/packages" element={<Outbound />} />
                <Route path="/packages/:id" element={<PackageDetails />} />
                <Route path="/destinations" element={<Navigate to="/packages" replace />} />
                <Route path="/corporate" element={<Corporate />} />
                <Route path="/vendor-packages/:vendorId" element={<VendorPackages />} />
                <Route path="/cruise" element={<Cruise />} />
                <Route path="/hotels" element={<Hotels />} />
                <Route path="/tours" element={<Tours />} />
                <Route path="/private-jets" element={<PrivateJets />} />
                <Route path="/sports" element={<Sports />} />
                <Route path="/contact" element={<ContactUs />} />

                {/* Protected Routes */}
                <Route path="/visa-application" element={
                  <ProtectedRoute>
                    <VisaApplication />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
            <Footer />
            <ChatWidget />
          </div>
        </CustomerAuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
