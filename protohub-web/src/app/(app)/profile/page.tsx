'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useUpdateProfile, useSkillCatalog, useAddSkill, useRemoveSkill } from '@/hooks/use-profile';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { X, Plus, Save } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const { data: catalog } = useSkillCatalog();
  const { mutate: addSkill } = useAddSkill();
  const { mutate: removeSkill } = useRemoveSkill();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    headline: user?.headline || '',
    bio: user?.bio || '',
    location: user?.location || '',
    education: user?.education || '',
    experience: user?.experience || '',
  });

  const [skillInput, setSkillInput] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
  };

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      // Check if the entered skill matches an available skill exactly (case-insensitive)
      const existingSkill = availableSkills.find(s => s.name.toLowerCase() === skillInput.trim().toLowerCase());
      if (existingSkill) {
        addSkill({ skillId: existingSkill.id });
      } else {
        addSkill({ name: skillInput.trim() });
      }
      setSkillInput('');
    }
  };

  if (!user) return null;

  const userSkills = user.skills || [];
  const availableSkills = catalog?.filter((s) => !userSkills.some((us: any) => us.skill.id === s.id)) || [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8 animate-fade-in">
      <div className="mb-10 relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface to-surface-raised border border-white/5 p-8 shadow-glow">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-accent/20 rounded-full blur-[80px] animate-pulse-slow" />
        <h1 className="text-3xl font-bold text-ink relative z-10">Edit <span className="text-gradient">Profile</span></h1>
        <p className="text-ink-muted mt-2 relative z-10">Manage your personal information, bio, and skills.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="flex items-center gap-6 mb-6">
                <Avatar name={user.name} src={user.avatarUrl} size={80} />
                <div>
                  <p className="text-sm font-medium text-ink">Profile Picture</p>
                  <p className="text-xs text-ink-muted mt-1 mb-3">Avatar URLs can be updated via the API.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={formData.name} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="headline">Headline</Label>
                  <Input id="headline" value={formData.headline} onChange={handleChange} placeholder="e.g. Developer at Example" />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={formData.location} onChange={handleChange} placeholder="e.g. San Francisco, CA" />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={handleChange}
                  className="flex w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-faint outline-none transition-all duration-300 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:shadow-[0_0_15px_rgba(139,92,246,0.15)] resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <Label htmlFor="education">Education</Label>
                <Input id="education" value={formData.education} onChange={handleChange} placeholder="e.g. B.S. Computer Science" />
              </div>

              <div>
                <Label htmlFor="experience">Experience</Label>
                <Input id="experience" value={formData.experience} onChange={handleChange} placeholder="e.g. 3 years as a Frontend Engineer" />
              </div>

              <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-base font-semibold text-ink mb-4">Your Skills</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {userSkills.map((us: any) => (
                <div key={us.id} className="flex items-center gap-2 bg-surface-hover px-3 py-1.5 rounded-md border border-border">
                  <span className="text-sm text-ink">{us.skill.name}</span>
                  <button onClick={() => removeSkill(us.skill.id)} className="text-ink-muted hover:text-danger">
                    <X size={14} />
                  </button>
                </div>
              ))}
              {userSkills.length === 0 && <p className="text-sm text-ink-muted">No skills added yet.</p>}
            </div>

            <h4 className="text-sm font-medium text-ink mb-2">Add a Skill</h4>
            <div className="flex gap-2">
              <Input
                list="available-skills"
                className="h-9"
                placeholder="Type a skill (e.g. React, TypeScript)..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
              />
              <datalist id="available-skills">
                {availableSkills.map((s) => (
                  <option key={s.id} value={s.name} />
                ))}
              </datalist>
              <Button type="button" onClick={handleAddSkill} disabled={!skillInput.trim()} size="sm" className="px-3">
                <Plus size={16} />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
