'use client';

import { createUser, getUserById, updateUser } from '@/actions/user';
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
import { UserStatus } from '../../../../../generated/prisma';
import { FormSelect } from '@/components/form/form-select';

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(6).max(20).optional().nullable(),
  status: z.nativeEnum(UserStatus),
});

export type UserFormValues = z.infer<typeof schema>;

interface AddEditUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id?: string | null;
  onSuccess?: () => void;
}

export default function AddEditUserModal({
  open,
  onOpenChange,
  id,
  onSuccess,
}: AddEditUserModalProps) {
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: useMemo(
      () => ({ name: '', email: '', phone: '', status: 'INACTIVE' }),
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
        const res = await getUserById(id);
        if (mounted && res?.success && res.data) {
          form.reset({
            name: res.data.name ?? '',
            email: res.data.email ?? '',
            phone: (res.data as any).phone ?? '',
            status: (res.data as any).status ?? 'INACTIVE',
          });
        }
        setLoading(false);
      } else {
        form.reset({ name: '', email: '', phone: '', status: 'INACTIVE' });
      }
      if (mounted) setInitialLoaded(true);
    }
    load();
    return () => {
      mounted = false;
    };
  }, [open, isEdit, id]);

  async function onSubmit(values: UserFormValues) {
    setLoading(true);
    const payload = {
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone ? values.phone.trim() : null,
      status: values.status,
    };
    const res =
      isEdit && id ? await updateUser(id, payload) : await createUser(payload);
    setLoading(false);
    if (res?.success) {
      onOpenChange(false);
      onSuccess?.();
    } else {
      const message = res?.message || 'Operation failed';
      if (message.toLowerCase().includes('email'))
        form.setError('email', { message });
      else form.setError('name', { message });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit User' : 'Add User'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the selected user.' : 'Create a new user entry.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              name="name"
              label="Name"
              placeholder="e.g. John Doe"
              disabled={loading}
            />
            <FormInput
              name="email"
              label="Email"
              placeholder="example@mail.com"
              disabled={loading}
            />
            <FormInput
              name="phone"
              label="Phone"
              placeholder="Optional"
              disabled={loading}
            />
            <FormSelect
              name="status"
              label="Status"
              options={[
                { value: 'ACTIVE', label: 'Active' },
                { value: 'INACTIVE', label: 'Inactive' },
                { value: 'SUSPENDED', label: 'Suspended' },
              ]}
              placeholder="Select status"
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
