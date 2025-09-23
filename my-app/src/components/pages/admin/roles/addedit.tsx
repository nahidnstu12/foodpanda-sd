'use client';

import { createRole, getRoleById, updateRole } from '@/actions/roles';
import { FormInput } from '@/components/form/form-input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CommonStatus } from '../../../../../generated/prisma';
import { FormSelect } from '@/components/form/form-select';

const schema = z.object({
  name: z.string().min(2, 'Name is too short').max(100),
  key: z
    .string()
    .min(2, 'Key is too short')
    .max(120)
    .regex(/^[a-z0-9_.:-]+$/i, 'Use alphanumerics, ., _, :, -'),
  description: z.string().max(500).optional().nullable(),
  status: z.nativeEnum(CommonStatus),
});

export type PermissionFormValues = z.infer<typeof schema>;

interface AddEditPermissionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id?: string | null; // if present -> edit mode
  onSuccess?: () => void; // ask parent to refresh table
}

export default function AddEditModal({
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
      () => ({ name: '', key: '', group: '', description: '' }),
      []
    ),
    mode: 'onSubmit',
  });

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!open) return;
      if (isEdit && id) {
        setLoading(true);
        const res = await getRoleById(id);
        if (mounted && res?.success && res.data) {
          form.reset({
            name: res.data.name ?? '',
            key: res.data.key ?? '',
            status: (res.data as any).status ?? '',
            description: (res.data as any).description ?? '',
          });
        }
        setLoading(false);
      } else {
        form.reset({ name: '', key: '', status: 'ACTIVE', description: '' });
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
      status: values.status,
      description: values.description ? values.description.trim() : null,
    };
    const res =
      isEdit && id ? await updateRole(id, payload) : await createRole(payload);
    setLoading(false);
    if (res?.success) {
      onOpenChange(false);
      onSuccess?.();
    } else {
      const message = res?.message || 'Operation failed';
      // surface error inline on key if unique constraint
      if (message.toLowerCase().includes('key')) {
        form.setError('key', { message });
      } else {
        form.setError('name', { message });
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Role' : 'Add Role'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the selected role.' : 'Create a new role entry.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              name="name"
              label="Name"
              placeholder="e.g. Manage Users"
              disabled={loading}
            />
            <FormInput
              name="key"
              label="Key"
              placeholder="e.g. user.manage"
              disabled={loading}
            />
            <FormSelect
              name="status"
              label="Status"
              options={[
                { value: 'ACTIVE', label: 'Active' },
                { value: 'INACTIVE', label: 'Inactive' },
                { value: 'SUSPENDED', label: 'Suspended' },
                { value: 'DELETED', label: 'Deleted' },
              ]}
              placeholder="Select status"
            />
            <FormInput
              name="description"
              label="Description"
              placeholder="Optional description"
              disabled={loading}
              variant="textarea"
            />
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {isEdit ? 'Save Changes' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
