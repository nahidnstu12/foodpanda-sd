import Login from '@/components/pages/login';
import db from '@/lib/prisma';
import React from 'react';

export default async function page() {
  const users = await db.user.findFirst();
  console.log(users);
  return (
    <div className="flex h-screen items-center justify-center">
      <Login />
    </div>
  );
}
