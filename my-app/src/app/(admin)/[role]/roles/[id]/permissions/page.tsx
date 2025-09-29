"use client";

import { assignRolePermissions, getRolePermissions } from "@/actions/roles";
import { listAllPermissions } from "@/actions/permissions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";

type Permission = {
  id: string;
  name: string;
  key: string;
  group: string | null;
};

export default function RolePermissionsPage() {
  const router = useRouter();
  const params = useParams();
  const roleId = params?.id as string;

  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      // fetch all permissions and current selections
      const [allRes, current] = await Promise.all([
        listAllPermissions(),
        getRolePermissions(roleId),
      ]);
      if (!mounted) return;
      if (allRes?.success) setAllPermissions(allRes.data as Permission[]);
      if (current?.success) {
        setSelected(new Set(current.data?.map((p: Permission) => p.id) ?? []));
      }
      setLoading(false);
    }
    if (roleId) load();
    return () => {
      mounted = false;
    };
  }, [roleId]);

  const grouped = useMemo(() => {
    const map = new Map<string, Permission[]>();
    for (const p of allPermissions) {
      const g = p.group || "Ungrouped";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(p);
    }
    return Array.from(map.entries());
  }, [allPermissions]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleGroup = (ids: string[], checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      for (const id of ids) {
        if (checked) next.add(id);
        else next.delete(id);
      }
      return next;
    });
  };

  async function onSave() {
    setSaving(true);
    const res = await assignRolePermissions(roleId, Array.from(selected));
    setSaving(false);
    if (res?.success) router.back();
  }

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="container mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Assign Permissions</h2>
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
        {grouped.map(([groupName, perms]) => {
          const ids = perms.map((p) => p.id);
          const allChecked = ids.every((id) => selected.has(id));
          const someChecked = !allChecked && ids.some((id) => selected.has(id));
          return (
            <Card key={groupName}>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-base">{groupName}</CardTitle>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={allChecked}
                    onCheckedChange={(v) => toggleGroup(ids, Boolean(v))}
                  />
                  <span className="text-sm text-muted-foreground">
                    {someChecked ? "Select all (partial)" : "Select all"}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {perms.map((p) => (
                  <label key={p.id} className="flex items-center gap-2">
                    <Checkbox
                      checked={selected.has(p.id)}
                      onCheckedChange={() => toggle(p.id)}
                    />
                    <span className="text-sm">{p.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({p.key})
                    </span>
                  </label>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
