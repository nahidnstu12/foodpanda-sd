'use client';

import { listActiveRoles } from '@/actions/roles';
import { setUserRole, findUserRoles } from '@/actions/user';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';

interface RoleChangeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: string | null;
  onSuccess?: () => void;
}

export default function RoleChangeModal({
  open,
  onOpenChange,
  userId,
  onSuccess,
}: RoleChangeModalProps) {
  const [roles, setRoles] = useState<
    { id: string; name: string; key: string }[]
  >([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!open) return;
      const [r, u] = await Promise.all([
        listActiveRoles(),
        userId ? findUserRoles(userId) : Promise.resolve(null),
      ]);
      if (!mounted) return;
      if (r?.success) setRoles(r.data ?? []);
      if (u && (u as any).success) {
        const user = (u as any).data;
        // find role id from user's selected role key
        const current = (r?.data ?? []).find(
          (x: any) => x.key === user.selected_role
        );
        setSelectedRoleId(current?.id ?? '');
      } else {
        setSelectedRoleId('');
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [open, userId]);

  const handleSave = async () => {
    if (!userId || !selectedRoleId) return;
    setLoading(true);
    const res = await setUserRole(userId, selectedRoleId);
    setLoading(false);
    if (res?.success) {
      onOpenChange(false);
      onSuccess?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change User Role</DialogTitle>
          <DialogDescription>Select a role and confirm.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">Role</div>
          <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.name} ({r.key})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!selectedRoleId || loading}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
