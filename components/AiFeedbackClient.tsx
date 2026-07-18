'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface AIFeedbackClientProps {
  id: string;
}

const AIFeedbackClient = ({ id }: AIFeedbackClientProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchFeedback = async () => {
    setLoading(true);
    setError(null);

    try {
      // Construct the absolute URL for the API request
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
      const apiUrl = `${baseUrl}/api/startup/${id}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI feedback');
      }

      const data = await response.json();
      const feedback = encodeURIComponent(data.result || 'No feedback available');

      // Redirect to feedback page with feedback as query parameter
      router.push(`/startup/${id}/feedback?feedback=${feedback}`);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch AI feedback. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Button
        onClick={fetchFeedback}
        disabled={loading}
        className="btn-primary text-white"
      >
        {loading ? 'Fetching Feedback...' : 'Get AI Feedback'}
      </Button>
      {error && (
        <p className="mt-3 text-red-500 text-16-medium">{error}</p>
      )}
    </div>
  );
};

export default AIFeedbackClient;