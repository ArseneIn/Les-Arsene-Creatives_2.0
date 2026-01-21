import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Impact } from './pages/Impact';
import { Contact } from './pages/Contact';
import { Donation } from './pages/Donation';
import { Leadership } from './pages/Leadership';
import { Founder } from './pages/Founder';
import { Safeguarding } from './pages/Safeguarding';
import { WPSProgram } from './pages/WPSProgram';
import { SuccessStories } from './pages/SuccessStories';
import { News } from './pages/News';
import { Resources } from './pages/Resources';
import { Partnerships } from './pages/Partnerships';

import { ScrollToTop } from './components/ScrollToTop';

// Admin Imports
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import NewsManager from './pages/admin/NewsManager';
import ResourceManager from './pages/admin/ResourceManager';
import PartnerManager from './pages/admin/PartnerManager';

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="impact" element={<Impact />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="donate" element={<Donation />} />
                    <Route path="about/leadership" element={<Leadership />} />
                    <Route path="about/founder" element={<Founder />} />
                    <Route path="safeguarding" element={<Safeguarding />} />
                    <Route path="programs/wps" element={<WPSProgram />} />
                    <Route path="impact/stories" element={<SuccessStories />} />
                    <Route path="news" element={<News />} />
                    <Route path="resources" element={<Resources />} />
                    <Route path="partnerships" element={<Partnerships />} />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/news" element={<NewsManager />} />
                <Route path="/admin/resources" element={<ResourceManager />} />
                <Route path="/admin/partners" element={<PartnerManager />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
