import { useEffect } from 'react';
import { Navigate, Routes, Route, useLocation } from 'react-router-dom';
import Footer from './includes/footer';
import Navbar from './includes/navbar';
import Convert from './pages/convert';
import Reading from './pages/reading';
import Editor from './pages/editor';
import NotFound from './pages/not-found';

function App() {
    const { pathname } = useLocation();

    // A new page starts at the top, as it would on a site without client-side routing.
    useEffect(() => {
        document.documentElement.scrollTop = 0;
    }, [pathname]);

    return (
        <div className="bf">
            <Navbar />
            <main className="bf-main">
                <div className="bf-page" key={ pathname }>
                    <Routes>
                        <Route path="/" element={ <Navigate to="/convert" replace /> } />
                        <Route path="/convert" element={ <Convert /> } />
                        <Route path="/convert/:id" element={ <Reading /> } />
                        <Route path="/convert/:id/edit" element={ <Editor /> } />
                        <Route path="*" element={ <NotFound /> } />
                    </Routes>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default App;
