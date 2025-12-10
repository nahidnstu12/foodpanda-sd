import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface DateRangePickerProps {
    label: string;
    value: {
        from: Date | undefined;
        to: Date | undefined;
    };
    onChange: (value: { from: Date | undefined; to: Date | undefined }) => void;
    name: string;
}

export default function DateRangePicker({ label, value, onChange, name }: DateRangePickerProps) {
    const [fromOpen, setFromOpen] = useState(false);
    const [toOpen, setToOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setFromOpen(false);
                setToOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleFromSelect = (date: Date | undefined) => {
        onChange({ ...value, from: date });
        setFromOpen(false);
    };

    const handleToSelect = (date: Date | undefined) => {
        onChange({ ...value, to: date });
        setToOpen(false);
    };

    return (
        <div className="grid grid-cols-4 items-center gap-4" ref={containerRef}>
            <label htmlFor={name} className="text-right">
                {label}
            </label>
            <div className="col-span-3 flex gap-2">
                <div className="relative w-full">
                    <Button
                        variant="outline"
                        className={cn(
                            'w-full justify-between',
                            !value.from && 'text-muted-foreground'
                        )}
                        onClick={() => setFromOpen(!fromOpen)}
                        type="button"
                    >
                        {value.from ? format(value.from, 'PPP') : 'From date'}
                        <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>

                    {fromOpen && (
                        <div className="bg-popover absolute z-50 mt-1 w-auto rounded-md border p-4 shadow-md">
                            <Calendar
                                mode="single"
                                selected={value.from}
                                onSelect={handleFromSelect}
                                initialFocus
                                captionLayout="dropdown"
                                fromYear={2000}
                                toYear={2030}
                            />
                        </div>
                    )}
                </div>

                <div className="relative w-full">
                    <Button
                        variant="outline"
                        className={cn(
                            'w-full justify-between',
                            !value.to && 'text-muted-foreground'
                        )}
                        onClick={() => setToOpen(!toOpen)}
                        type="button"
                    >
                        {value.to ? format(value.to, 'PPP') : 'To date'}
                        <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>

                    {toOpen && (
                        <div className="bg-popover absolute z-50 mt-1 w-auto rounded-md border p-4 shadow-md">
                            <Calendar
                                mode="single"
                                selected={value.to}
                                onSelect={handleToSelect}
                                initialFocus
                                captionLayout="dropdown"
                                fromYear={2000}
                                toYear={2030}
                                disabled={(date) => value.from ? date < value.from : false}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 