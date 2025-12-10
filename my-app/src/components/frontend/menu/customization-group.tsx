import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import ChoiceItem from './choice-item';

interface CustomizationGroupProps {
    customization: any;
    selectedChoices: string[];
    onChoiceChange: (choiceId: string) => void;
  }
  
  export default function CustomizationGroup({
    customization,
    selectedChoices,
    onChoiceChange,
  }: CustomizationGroupProps) {
    const isSingleSelect = customization.max_selection === 1;
  
    return (
      <div>
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <Label className="text-[#1C1C1C] font-semibold text-base">
              {customization.name}
            </Label>
            {customization.is_required ? (
              <Badge className="bg-[#FF6B6B] hover:bg-[#FF6B6B] text-xs">Required</Badge>
            ) : (
              <Badge variant="secondary" className="text-xs">Optional</Badge>
            )}
          </div>
          <p className="text-xs text-[#9CA3AF]">
            {customization.max_selection === 1
              ? 'Select 1 option'
              : `Select up to ${customization.max_selection} options`}
          </p>
        </div>
  
        <div className="space-y-2">
          {customization.choices.map((choice: any) => (
            <ChoiceItem
              key={choice.id}
              choice={choice}
              isSelected={selectedChoices.includes(choice.id)}
              isSingleSelect={isSingleSelect}
              onSelect={() => onChoiceChange(choice.id)}
              disabled={!choice.is_available}
            />
          ))}
        </div>
      </div>
    );
  }