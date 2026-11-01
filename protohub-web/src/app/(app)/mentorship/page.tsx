'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card } from '@/components/ui/card';

export default function MentorshipPage() {
  const { data: received } = useQuery({
    queryKey: ['mentorship', 'received'],
    queryFn: () => api.get('/mentorship-requests/received'),
  });
  const { data: sent } = useQuery({
    queryKey: ['mentorship', 'sent'],
    queryFn: () => api.get('/mentorship-requests/sent'),
  });

  return (
    <div className="mx-auto max-w-2xl px-8 py-8">
      <h1 className="text-xl font-semibold text-ink">Mentorship</h1>
      <p className="mt-1 text-[13px] text-ink-muted">
        The full request/accept/reject API is live — this page is a minimal read-only view for now.
      </p>
      <Card className="mt-6 p-4">
        <pre className="overflow-x-auto text-[12px] text-ink-muted">
          {JSON.stringify({ received, sent }, null, 2)}
        </pre>
      </Card>
    </div>
  );
}
