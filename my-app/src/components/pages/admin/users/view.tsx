'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getUserById } from '@/actions/user';

interface ViewUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id?: string | null;
}

export default function ViewModal({
  open,
  onOpenChange,
  id,
}: ViewUserModalProps) {
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!open || !id) return setData(null);
      const res = await getUserById(id);
      if (mounted) setData(res?.success ? res.data : null);
    }
    load();
    return () => {
      mounted = false;
    };
  }, [open, id]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>Read-only view</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <div className="text-muted-foreground">Name</div>
            <div className="col-span-2">{data?.name ?? '-'}</div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-muted-foreground">Email</div>
            <div className="col-span-2">{data?.email ?? '-'}</div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-muted-foreground">Phone</div>
            <div className="col-span-2">{data?.phone ?? '-'}</div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-muted-foreground">Status</div>
            <div className="col-span-2">{data?.status ?? '-'}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
