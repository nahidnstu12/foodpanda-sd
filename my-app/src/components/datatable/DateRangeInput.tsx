import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DateRangeInputProps {
    label: string;
    value: {
        from: string | undefined;
        to: string | undefined;
    };
    onChange: (value: { from: string | undefined; to: string | undefined }) => void;
    name: string;
}

export default function DateRangeInput({ label, value, onChange, name }: DateRangeInputProps) {
    // Convert string to Date for the picker
    const fromDate = value.from ? new Date(value.from) : null;
    const toDate = value.to ? new Date(value.to) : null;

    return (
        <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor={`${name}_from`} className="text-right">
                {label}
            </label>
            <div className="col-span-3 flex gap-2">
                <DatePicker
                    selected={fromDate}
                    onChange={date => onChange({ ...value, from: date ? date.toISOString().slice(0, 10) : undefined })}
                    selectsStart
                    startDate={fromDate}
                    endDate={toDate}
                    placeholderText="From date"
                    className="input border border-gray-600/50 shadow-sm py-1 rounded-md pl-2 w-full pr-3 text-black"
                    dateFormat="yyyy-MM-dd"
                    name={`${name}_from`}
                    maxDate={toDate || undefined}
                    isClearable
                />
                <span className="self-center">to</span>
                <DatePicker
                    selected={toDate}
                    onChange={date => onChange({ ...value, to: date ? date.toISOString().slice(0, 10) : undefined })}
                    selectsEnd
                    startDate={fromDate}
                    endDate={toDate}
                    placeholderText="To date"
                    className="input border border-gray-600/50 shadow-sm py-1 rounded-md pl-2 w-full pr-3 text-black"
                    dateFormat="yyyy-MM-dd"
                    name={`${name}_to`}
                    minDate={fromDate || undefined}
                    isClearable
                />
            </div>
        </div>
    );
}
