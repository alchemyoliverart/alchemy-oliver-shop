import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function NotFound() {
  return (
    <div className="not-found">
      <Helmet>
        <title>Page Not Found — Alchemy Oliver</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <span className="not-found-code">404</span>
      <p className="not-found-message">this page doesn't exist</p>
      <Link to="/" className="not-found-link">← back home</Link>
    </div>
  );
}
