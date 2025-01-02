import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

interface IdleTimerProps {
  timeout: number; // Timeout in milliseconds
}

export default function IdleTimer({ timeout }: IdleTimerProps) {
  const [isIdle, setIsIdle] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let idleTimer: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => setIsIdle(true), timeout);
    };

    const events = [
      'mousemove',
      'keydown',
      'mousedown',
      'touchstart',
      'scroll',
    ];

    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      clearTimeout(idleTimer);
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [timeout]);

  useEffect(() => {
    if (isIdle) {
      Cookies.remove('token');
      //Cookies.remove('username');
      navigate('/auth/login', { replace: true });
    }
  }, [isIdle, navigate]);

  return null;
}

