import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DetailsPage from './pages/DetailsPage';
import Layout from './components/Layout';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path=":type/:id" element={<DetailsPage />} />
    </Route>
  </Routes>
);

export default AppRoutes;
