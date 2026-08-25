import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from "../ui/select";

type Option = {
  id: string;
  name: string;
};

type Props = {
  options?: Option[];
  onValueChange: (value: string) => void;
  placeholder?: string;
  value?: string;
};

export const FilterSelect = ({
  options,
  onValueChange,
  placeholder,
  value,
}: Props) => {
  return (
    <div className="select-wrapper">
      <Select value={value ?? ""} onValueChange={onValueChange}>
        <SelectTrigger className="h-auto w-full border-0 bg-transparent p-0 text-[16px] leading-[22px] font-medium text-[#222222] shadow-none focus:ring-0">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="rounded-2xl border-0 bg-white p-2 shadow-none">
          <SelectGroup>
            {options?.map((o) => (
              <SelectItem
                key={o.id}
                value={o.id}
                className="cursor-pointer rounded-lg px-3 py-2 text-[16px] leading-[22px] font-medium text-[#222222] focus:bg-black/10 data-[state=checked]:bg-black/20"
              >
                {o.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
