import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AICopilot from './components/AICopilot';

import Home from './pages/Home';
import Experience from './pages/Experience';
import DevBlog from './pages/DevBlog';
import BlogPost from './pages/BlogPost';
import PhotoPost from './pages/PhotoPost';
import ProjectPost from './pages/ProjectPost';
import Photography from './pages/Photography';
import About from './pages/About';
import Memory from './pages/Memory';
import Infrastructure from './pages/Infrastructure';

function App() {
  return (
    <Router>
      <Navbar />
      <main className="main-content container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/project/:slug" element={<ProjectPost />} />
          <Route path="/devblog" element={<DevBlog />} />
          <Route path="/devblog/:slug" element={<BlogPost />} />
          <Route path="/photography" element={<Photography />} />
          <Route path="/photography/:slug" element={<PhotoPost />} />
          <Route path="/memory" element={<Memory />} />
          <Route path="/designer" element={<Infrastructure />} />
        </Routes>
      </main>
      <Footer />
      <AICopilot />
    </Router>
  );
}

export default App;
