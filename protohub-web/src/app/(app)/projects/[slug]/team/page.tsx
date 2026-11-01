'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useProject, useProjectMembers, useJoinRequests, useRequestToJoin, useReviewJoinRequest } from '@/hooks/use-projects';
import { useAuth } from '@/lib/auth-context';
import { Card } from '@/components/ui/card';
import { Avatar, Badge } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ApiError } from '@/lib/api-client';

export default function TeamPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project } = useProject(slug);
  const { data: members } = useProjectMembers(project?.id);
  const { data: joinRequests } = useJoinRequests(project?.id);
  const requestToJoin = useRequestToJoin(project?.id ?? '');
  const reviewRequest = useReviewJoinRequest(project?.id ?? '');
  const { user } = useAuth();
  const [joinError, setJoinError] = useState<string | null>(null);
  const [joinSent, setJoinSent] = useState(false);

  if (!project) return null;

  const isMember = members?.some((m) => m.userId === user?.id);
  const myRole = members?.find((m) => m.userId === user?.id)?.role;
  const canManage = myRole === 'OWNER' || myRole === 'MAINTAINER';

  const onRequestToJoin = async () => {
    setJoinError(null);
    try {
      await requestToJoin.mutateAsync(undefined);
      setJoinSent(true);
    } catch (err) {
      setJoinError(err instanceof ApiError ? err.message : 'Could not send request');
    }
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2">
        <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-ink-muted">
          Team ({members?.length ?? 0})
        </h2>
        <Card className="divide-y divide-border">
          {members?.map((m) => (
            <div key={m.id} className="flex items-center justify-between p-3">
              <div className="flex items-center gap-2.5">
                <Avatar name={m.user.name} src={m.user.avatarUrl} size={30} />
                <div>
                  <p className="text-[13px] font-medium text-ink">{m.user.name}</p>
                  {m.user.headline && <p className="text-[12px] text-ink-muted">{m.user.headline}</p>}
                </div>
              </div>
              <Badge variant={m.role === 'OWNER' ? 'accent' : 'default'}>{m.role}</Badge>
            </div>
          ))}
        </Card>

        {!isMember && !joinSent && (
          <div className="mt-4">
            <Button onClick={onRequestToJoin} disabled={requestToJoin.isPending}>
              {requestToJoin.isPending ? 'Sending…' : 'Request to join this project'}
            </Button>
            {joinError && <p className="mt-2 text-[13px] text-danger">{joinError}</p>}
          </div>
        )}
        {joinSent && <p className="mt-4 text-[13px] text-success">Request sent — the team will review it.</p>}
      </div>

      {canManage && (
        <div>
          <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-ink-muted">
            Pending requests ({joinRequests?.length ?? 0})
          </h2>
          <Card className="divide-y divide-border">
            {joinRequests?.map((req) => (
              <div key={req.id} className="p-3">
                <div className="flex items-center gap-2">
                  <Avatar name={req.requester.name} src={req.requester.avatarUrl} size={24} />
                  <span className="text-[13px] font-medium text-ink">{req.requester.name}</span>
                </div>
                {req.message && <p className="mt-1.5 text-[12px] text-ink-muted">{req.message}</p>}
                <div className="mt-2 flex gap-1.5">
                  <Button
                    size="sm"
                    onClick={() => reviewRequest.mutate({ requestId: req.id, status: 'ACCEPTED' })}
                    disabled={reviewRequest.isPending}
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => reviewRequest.mutate({ requestId: req.id, status: 'REJECTED' })}
                    disabled={reviewRequest.isPending}
                  >
                    Decline
                  </Button>
                </div>
              </div>
            ))}
            {joinRequests?.length === 0 && <p className="p-3 text-[13px] text-ink-muted">No pending requests.</p>}
          </Card>
        </div>
      )}
    </div>
  );
}
