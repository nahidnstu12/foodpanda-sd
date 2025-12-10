'use client';

import { listAllPermissions } from '@/actions/permissions';
import { getRolePermissions } from '@/actions/roles';
import {
  getUserDirectPermissions,
  setUserDirectPermissions,
} from '@/actions/user';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type Permission = {
  id: string;
  name: string;
  key: string;
  group: string | null;
};

// grant-only UI

export default function UserPermissionsPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id as string;
  const roleId = (params?.role as string) || '';

  const [all, setAll] = useState<Permission[]>([]);
  const [rolePermIds, setRolePermIds] = useState<Set<string>>(new Set());
  const [directGrants, setDirectGrants] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      const [allRes, roleRes, directRes] = await Promise.all([
        listAllPermissions(),
        getRolePermissions(roleId),
        getUserDirectPermissions(userId),
      ]);
      if (!mounted) return;
      if (allRes?.success) setAll(allRes.data as Permission[]);
      if (roleRes?.success && roleRes.data) {
        setRolePermIds(
          new Set((roleRes.data as Permission[]).map((p) => p.id))
        );
      }
      if (directRes?.success)
        setDirectGrants(new Set(directRes.data as string[]));
      setLoading(false);
    }
    if (userId && roleId) load();
    return () => {
      mounted = false;
    };
  }, [userId, roleId]);

  const grouped = useMemo(() => {
    const map = new Map<string, Permission[]>();
    for (const p of all) {
      const g = p.group || 'Ungrouped';
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(p);
    }
    return Array.from(map.entries());
  }, [all]);

  const toggleGrant = (id: string) => {
    setDirectGrants((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  async function onSave() {
    setSaving(true);
    const res = await setUserDirectPermissions(
      userId,
      Array.from(directGrants)
    );
    setSaving(false);
    if (res?.success) router.back();
  }

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="container mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">User Permission Overrides</h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button onClick={onSave} disabled={saving}>
            Save
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {grouped.map(([groupName, perms]) => (
          <Card key={groupName}>
            <CardHeader>
              <CardTitle className="text-base">{groupName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {perms.map((p) => {
                const inherited = rolePermIds.has(p.id);
                const checked = inherited || directGrants.has(p.id);
                const disabled = inherited;
                return (
                  <div key={p.id} className="flex items-center gap-3">
                    <Checkbox
                      checked={checked}
                      disabled={disabled}
                      onCheckedChange={() => toggleGrant(p.id)}
                    />
                    <span className="text-sm">{p.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({p.key})
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
