import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AnnouncementBanner, { BANNER_HEIGHT_PX } from './components/layout/AnnouncementBanner';
import WhatsAppButton from './components/ui/WhatsAppButton';
import Home from './pages/Home';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import Certifications from './pages/Certifications';
import BookNow from './pages/BookNow';
import Contact from './pages/Contact';
import ConsentForm from './pages/ConsentForm';
import CorporateForm from './pages/CorporateForm';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ScrollToTop from './components/utils/ScrollToTop';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AnnouncementBanner />
        <div className="flex flex-col min-h-screen" style={{ marginTop: BANNER_HEIGHT_PX }}>
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/certifications" element={<Certifications />} />
              <Route path="/shop" element={<Navigate to="/services" replace />} />
              <Route path="/cart" element={<Navigate to="/services" replace />} />
              <Route path="/checkout" element={<Navigate to="/book" replace />} />
              <Route path="/book" element={<BookNow />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/consent" element={<ConsentForm />} />
              <Route path="/reservation-entreprise" element={<CorporateForm />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Routes>
          </main>
          <Footer />
          <WhatsAppButton />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
