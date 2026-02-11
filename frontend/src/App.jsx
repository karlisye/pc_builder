import { Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Build from './pages/Build';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/build" element={<Build />} />
      </Routes>
    </Layout>
  );
}

export default App;
