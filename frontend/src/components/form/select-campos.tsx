import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { UseFormRegisterReturn } from 'react-hook-form';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  rotulo: string;
  options: SelectOption[];
  erro?: string;
  placeholder?: string;
  ValueOnChange?: (value: string) => void;
  register?: UseFormRegisterReturn;
  disabled?: boolean;
  required?: boolean;
}

const SelectField = React.forwardRef<HTMLButtonElement, SelectFieldProps>(
  ({ 
    rotulo, 
    options, 
    erro,
    ValueOnChange ,

    placeholder = "Selecione uma opção", 
    register,
    disabled = false,
    required = false,
    ...rest 
  }, ref) => {
    return (
      <div className="space-y-2 w-full">
        <Label 
          htmlFor={register?.name} 
          className="text-sm font-medium text-gray-200"
        >
          {rotulo}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        
        <Select 
          onValueChange={(value) => {
         if (ValueOnChange) {
              ValueOnChange(value);
            }
            if (register?.onChange) {
              register.onChange({
                target: { 
                  name: register.name, 
                  value 
                }
              });
            }
          }}
          disabled={disabled}
          {...rest}
        >
          <SelectTrigger 
            ref={ref}
            className={`w-full bg-gray-700 border-gray-600 text-white ${
              erro ? 'border-red-500 focus:ring-red-500' : 'focus:ring-emerald-500'
            } focus:ring-2 focus:border-transparent`}
            id={register?.name}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          
          <SelectContent className="bg-gray-700 border-gray-600 text-white">
            {options.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value}
                className="focus:bg-gray-600 focus:text-white hover:bg-gray-600"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {erro && (
          <p className="text-red-400 text-xs font-medium mt-1">{erro}</p>
        )}
      </div>
    );
  }
);

SelectField.displayName = 'SelectField';

export default SelectField;