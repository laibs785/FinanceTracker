
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const token = localStorage.getItem('token');

  
  return token ? children : null;
}

export default PrivateRoute;