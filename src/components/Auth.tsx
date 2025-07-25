import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Auth = (props: { children: JSX.Element }) => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, []);

  if (!token) {
    return null;
  }
  return props.children;
};

export default Auth;
