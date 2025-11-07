import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authStorage } from '../lib/auth';

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');

      if (!token) {
        navigate('/login?error=authentication_failed', { replace: true });
        return;
      }

      authStorage.setToken(token);

      try {
        const response = await fetch(
          `${API_URL}/api/riot/verification/status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();

          if (data.verified) {
            navigate('/', { replace: true });
          } else {
            navigate('/onboarding', { replace: true });
          }
        } else {
          navigate('/onboarding', { replace: true });
        }
      } catch (error) {
        console.error('Error checking verification status:', error);
        navigate('/onboarding', { replace: true });
      } finally {
        setIsChecking(false);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-muted-foreground">
          {isChecking ? 'Completing authentication...' : 'Redirecting...'}
        </p>
      </div>
    </div>
  );
}
