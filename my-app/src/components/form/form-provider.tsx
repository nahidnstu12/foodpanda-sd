import { useEffect, useTransition } from "react";
import { FormProvider as FormProviderRHF, useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";

type FormProviderProps = {
  children: React.ReactNode;
  onSubmit: (formData: FormData) => Promise<any>;
  resolver?: Resolver<any>;
  defaultValues?: Record<string, any>;
  itemData?: Record<string, any>;
  formName?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
};

export default function FormProvider({
  children,
  onSubmit,
  resolver,
  defaultValues,
  itemData,
  formName,
  onSuccess,
  onError,
}: FormProviderProps) {
  const [isPending, startTransition] = useTransition();

  const methods = useForm({
    resolver,
    defaultValues,
  });

  useEffect(() => {
    if (itemData) {
      methods.reset({
        ...itemData,
      });
    }
  }, [itemData, methods]);

  if (Object.keys(methods.formState.errors).length > 0) {
    console.log(`${formName} errors>>`, methods.formState.errors);
  }

  const handleFormSubmit = async (data: any) => {
    // Convert form data to FormData object
    const formData = new FormData();

    console.log("formprovider data>>", data);

    Object.keys(data).forEach((key) => {
      const value = data[key];
      if (value !== undefined && value !== null) {
        // Handle arrays (for multiple selections)
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(key, item));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    startTransition(async () => {
      try {
        const result = await onSubmit(formData);

        if (result?.success) {
          onSuccess?.(result.data);
        } else {
          onError?.(result?.error || "An error occurred");
        }
      } catch (error) {
        console.error("Form submission error:", error);
        onError?.(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        );
      }
    });
  };

  return (
    <FormProviderRHF {...methods}>
      <form onSubmit={methods.handleSubmit(handleFormSubmit)}>{children}</form>
    </FormProviderRHF>
  );
}
