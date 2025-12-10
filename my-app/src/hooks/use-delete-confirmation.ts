import { useState, useCallback } from "react";

export interface UseDeleteConfirmationOptions {
  onDelete: (id: string) => Promise<{ success?: boolean } | void>;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useDeleteConfirmation({
  onDelete,
  onSuccess,
  onError,
}: UseDeleteConfirmationOptions) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openDeleteDialog = useCallback((id: string) => {
    setDeleteId(id);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    if (!isDeleting) {
      setDeleteId(null);
    }
  }, [isDeleting]);

  const handleDelete = useCallback(async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const result = await onDelete(deleteId);
      setDeleteId(null);

      if (result?.success !== false) {
        onSuccess?.();
      }
    } catch (error) {
      onError?.(error as Error);
    } finally {
      setIsDeleting(false);
    }
  }, [deleteId, onDelete, onSuccess, onError]);

  return {
    deleteId,
    isDeleting,
    openDeleteDialog,
    closeDeleteDialog,
    handleDelete,
  };
}
