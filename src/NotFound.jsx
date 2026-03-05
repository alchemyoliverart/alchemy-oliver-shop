import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="not-found">
      <span className="not-found-code">404</span>
      <p className="not-found-message">this page doesn't exist</p>
      <Link to="/" className="not-found-link">← back home</Link>
    </div>
  );
}
