import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { logoutUser } from './http/api';
import { useMutation } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';

interface IdleTimerProps {
  timeout: number; // Timeout in milliseconds
}

// Define the interface for the decoded JWT data
interface JwtPayload {
  user: {
      id: string;
      username: string;
      role: string;
  };
}

export default function IdleTimer({ timeout }: IdleTimerProps) {
  const [isIdle, setIsIdle] = useState(false);
  const navigate = useNavigate();

  const token = Cookies.get('token');

  // Extract username from token (if exists)
  let username = "";
  if (token) {
    try {
      const decodedToken = jwtDecode(token) as JwtPayload;
      username = decodedToken.user.username || "Unknown User"; // Fallback if username is missing
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }
  

  // Define the logout mutation
  const mutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      Cookies.remove('token');
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
      mutation.mutate(username); // Call logout API when user is idle
    }
  }, [isIdle, mutation, username]);

  return null;
}

