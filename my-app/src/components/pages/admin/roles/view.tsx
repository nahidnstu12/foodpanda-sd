"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { getPermissionById } from "@/actions/permissions";

interface ViewPermissionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id?: string | null;
}

export default function ViewModal({
  open,
  onOpenChange,
  id,
}: ViewPermissionModalProps) {
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!open || !id) return setData(null);
      const res = await getPermissionById(id);
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
          <DialogTitle>Permission Details</DialogTitle>
          <DialogDescription>Read-only view</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <div className="text-muted-foreground">Name</div>
            <div className="col-span-2">{data?.name ?? "-"}</div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-muted-foreground">Key</div>
            <div className="col-span-2">{data?.key ?? "-"}</div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-muted-foreground">Group</div>
            <div className="col-span-2">{data?.group ?? "-"}</div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-muted-foreground">Description</div>
            <div className="col-span-2 whitespace-pre-wrap">
              {data?.description ?? "-"}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
