"use client";

import {
  createPermission,
  getPermissionById,
  updatePermission,
} from "@/actions/permissions";
import { FormInput } from "@/components/form/form-input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Form
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Name is too short").max(100),
  key: z
    .string()
    .min(2, "Key is too short")
    .max(120)
    .regex(/^[a-z0-9_.:-]+$/i, "Use alphanumerics, ., _, :, -"),
  group: z.string().max(80).optional().nullable(),
  description: z.string().max(500).optional().nullable(),
});

export type PermissionFormValues = z.infer<typeof schema>;

interface AddEditPermissionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id?: string | null; // if present -> edit mode
  onSuccess?: () => void; // ask parent to refresh table
}

export default function AddEditPermissionModal({
  open,
  onOpenChange,
  id,
  onSuccess,
}: AddEditPermissionModalProps) {
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);

  const form = useForm<PermissionFormValues>({
    resolver: zodResolver(schema),
    defaultValues: useMemo(
      () => ({ name: "", key: "", group: "", description: "" }),
      []
    ),
    mode: "onChange",
  });

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!open) return;
      if (isEdit && id) {
        setLoading(true);
        const res = await getPermissionById(id);
        if (mounted && res?.success && res.data) {
          form.reset({
            name: res.data.name ?? "",
            key: res.data.key ?? "",
            group: (res.data as any).group ?? "",
            description: (res.data as any).description ?? "",
          });
        }
        setLoading(false);
      } else {
        form.reset({ name: "", key: "", group: "", description: "" });
      }
      if (mounted) setInitialLoaded(true);
    }
    load();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isEdit, id]);

  async function onSubmit(values: PermissionFormValues) {
    setLoading(true);
    const payload = {
      name: values.name.trim(),
      key: values.key.trim(),
      group: values.group ? values.group.trim() : null,
      description: values.description ? values.description.trim() : null,
    };
    const res =
      isEdit && id
        ? await updatePermission(id, payload)
        : await createPermission(payload);
    setLoading(false);
    if (res?.success) {
      onOpenChange(false);
      onSuccess?.();
    } else {
      const message = res?.message || "Operation failed";
      // surface error inline on key if unique constraint
      if (message.toLowerCase().includes("key")) {
        form.setError("key", { message });
      } else {
        form.setError("name", { message });
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Permission" : "Add Permission"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the selected permission."
              : "Create a new permission entry."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              control={form.control}
              name="name"
              label="Name"
              placeholder="e.g. Manage Users"
              disabled={loading}
            />
            <FormInput
              control={form.control}
              name="key"
              label="Key"
              placeholder="e.g. user.manage"
              disabled={loading}
            />
            <FormInput
              control={form.control}
              name="group"
              label="Group"
              placeholder="e.g. users"
              disabled={loading}
            />
            <FormInput
              control={form.control}
              name="description"
              label="Description"
              placeholder="Optional description"
              disabled={loading}
              variant="textarea"
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
