import { Outlet, Link } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="app">
      <header className="app-header">
        <Link to="/" className="header-link">
          <h1 className="app-title">
            🎬 IDCFlix
          </h1>
          <p className="app-subtitle">
            Discover and explore movies & TV shows
          </p>
        </Link>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
