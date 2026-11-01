'use client';

import { useParams } from 'next/navigation';
import { useProject, useProjectAttachments } from '@/hooks/use-projects';
import { File, Download, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ProjectFilesPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project } = useProject(slug);
  const { data: attachments, isLoading } = useProjectAttachments(project?.id);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-accent" />
      </div>
    );
  }

  const handleUploadClick = () => {
    toast('Direct file uploads are coming soon!', {
      description: 'For now, you can upload files by sharing them in the project Chat.',
      icon: <UploadCloud size={16} />
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-ink">Project Files</h2>
          <p className="text-sm text-ink-muted">
            {attachments?.length || 0} file{attachments?.length === 1 ? '' : 's'} shared in this workspace
          </p>
        </div>
        <Button onClick={handleUploadClick} className="gap-2">
          <UploadCloud size={16} />
          Upload File
        </Button>
      </div>

      {attachments?.length === 0 ? (
        <div className="rounded-2xl border border-white/5 border-dashed bg-surface-raised p-16 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-surface border border-white/5 flex items-center justify-center mb-4">
            <File className="h-8 w-8 text-accent opacity-80" />
          </div>
          <h3 className="text-base font-semibold text-ink">No files yet</h3>
          <p className="mt-2 text-sm text-ink-muted max-w-sm">
            Files shared in tasks or chat will automatically be collected and organized here.
          </p>
          <Button onClick={handleUploadClick} variant="secondary" className="mt-6">
            Upload your first file
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {attachments?.map((file) => {
            const isImage = file.mimeType.startsWith('image/');
            return (
              <div 
                key={file.id} 
                className="group flex flex-col p-5 glass-card transition-all hover:shadow-glow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                    isImage ? 'bg-info/10 text-info' : 'bg-accent/10 text-accent'
                  }`}>
                    {isImage ? <ImageIcon size={24} /> : <File size={24} />}
                  </div>
                  <a 
                    href={file.url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-0 group-hover:opacity-100 p-2 rounded-full hover:bg-white/5 transition-all"
                    title="Download file"
                  >
                    <Download size={16} className="text-ink" />
                  </a>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink truncate" title={file.filename}>
                    {file.filename}
                  </p>
                  <p className="text-[11px] font-medium text-ink-muted mt-1 uppercase tracking-wider">
                    {formatDistanceToNow(new Date(file.createdAt), { addSuffix: true })}
                  </p>
                  <p className="text-xs text-ink-muted mt-2 truncate">
                    Uploaded by <span className="text-ink">{file.uploader.name}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
