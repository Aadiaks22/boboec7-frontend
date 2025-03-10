import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { logoutUser } from './http/api';
import { useMutation } from '@tanstack/react-query';

interface IdleTimerProps {
  timeout: number; // Timeout in milliseconds
}

export default function IdleTimer({ timeout }: IdleTimerProps) {
  const [isIdle, setIsIdle] = useState(false);
  const navigate = useNavigate();

  // Define the logout mutation
  const mutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      Cookies.remove('token');
      Cookies.remove('username');
      navigate('/', { replace: true });
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    }
  });

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
      mutation.mutate(); // Call logout API when user is idle
    }
  }, [isIdle, mutation]);

  return null;
}

