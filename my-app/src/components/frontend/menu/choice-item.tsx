import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

interface ChoiceItemProps {
  choice: any;
  isSelected: boolean;
  isSingleSelect: boolean;
  onSelect: () => void;
  disabled: boolean;
}

export default function ChoiceItem({
  choice,
  isSelected,
  isSingleSelect,
  onSelect,
  disabled,
}: ChoiceItemProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer',
        isSelected
          ? 'border-[#06C167] bg-[#06C167]/5'
          : 'border-gray-200 hover:border-[#06C167]/50',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      onClick={() => !disabled && onSelect()}
    >
      <div className="flex items-center gap-3 flex-1">
        {isSingleSelect ? (
          <RadioGroup value={isSelected ? choice.id : ''}>
            <RadioGroupItem
              value={choice.id}
              disabled={disabled}
              className="border-[#06C167] text-[#06C167]"
            />
          </RadioGroup>
        ) : (
          <Checkbox
            checked={isSelected}
            disabled={disabled}
            className="border-[#06C167] data-[state=checked]:bg-[#06C167]"
          />
        )}
        <Label
          className={cn(
            'font-medium cursor-pointer',
            disabled ? 'text-[#9CA3AF]' : 'text-[#1C1C1C]'
          )}
        >
          {choice.name}
          {disabled && <span className="ml-2 text-xs">(Unavailable)</span>}
        </Label>
      </div>
      {choice.price_change !== 0 && (
        <span
          className={cn(
            'text-sm font-semibold',
            choice.price_change > 0 ? 'text-[#06C167]' : 'text-[#FF6B6B]'
          )}
        >
          {choice.price_change > 0 ? '+' : ''}৳ {choice.price_change}
        </span>
      )}
    </div>
  );
}
