import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '../ui/label';
import { useFormContext, Controller } from 'react-hook-form';
import { cn } from '@/lib/utils';

type Option = {
  value: string | number;
  label: string;
};

type FormSelectProps = {
  label: string;
  name: string;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export function FormSelect({ 
  label, 
  name, 
  options, 
  placeholder,
  disabled,
  className 
}: FormSelectProps) {
  const { 
    control,
    formState: { errors }
  } = useFormContext();

  const error = errors[name]?.message as string;

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name}>{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select 
            value={field.value?.toString()} 
            onValueChange={field.onChange}
            disabled={disabled}
          >
            <SelectTrigger id={name} className={cn(error && "border-red-500", 'w-full')}>
              <SelectValue placeholder={placeholder || label} />
            </SelectTrigger>
            <SelectContent className='w-full'>
              <SelectGroup>
                {options.map((option) => (
                  <SelectItem 
                    key={option.value.toString()} 
                    value={option.value.toString()}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
