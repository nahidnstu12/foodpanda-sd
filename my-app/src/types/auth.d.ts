import 'better-auth';

declare module 'better-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      emailVerified: boolean;
      name: string;
      createdAt: Date;
      updatedAt: Date;
      image?: string | null;
      roles?: string[];
      role_id?: string;
      status?: string;
      is_phone_verified?: boolean;
      phone?: string;
      deleted_at?: Date;
    };
  }
}