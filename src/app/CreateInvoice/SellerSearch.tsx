"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getBuyer } from "@/lib/api/getBuyer";

type BuyerOption = { value: string; label: string; location: string };

type Props = {
  value: { name: string; location: string } | null;
  onSellerChange: (value: { name: string; location: string } | null) => void;
};

export default function SellerSearch({ onSellerChange, value }: Props) {
  const [open, setOpen] = React.useState(false);
  const [buyers, setBuyers] = React.useState<BuyerOption[]>([]);

  // утиліти
  const safe = (s?: string) => (s ?? "").trim() || "Невідомий покупець";
  const makeKey = (name: string, location: string) =>
    `${name}||${location}`; // унікальний ключ значення

  React.useEffect(() => {
    const fetchBuyers = async () => {
      const data = await getBuyer();
      const formattedData: BuyerOption[] = data.map((b: any) => {
        const name = safe(b.name);
        const location = safe(b.location);
        return {
          value: makeKey(name, location),
          label: name,
          location,
        };
      });
      setBuyers(formattedData);
    };
    fetchBuyers();
  }, []);

  // рядок у кнопці
  const buttonText = value
    ? `${value.name} (${value.location})`
    : "Оберіть покупця...";

  // активний елемент (для галочки)
  const activeValue = value ? makeKey(safe(value.name), safe(value.location)) : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
          title={buttonText}
        >
          <span className="block max-w-[230px] overflow-hidden text-ellipsis whitespace-nowrap">
            {buttonText}
          </span>
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Оберіть покупця..." />
          <CommandList>
            <CommandEmpty>Покупець не знайдений.</CommandEmpty>
            <CommandGroup>
              {buyers.map((buyer, index) => (
                <CommandItem
                  key={`${buyer.value}-${index}`} // унікальний ключ навіть для дублікатів
                  value={buyer.value}             // значення = name||location
                  onSelect={(currentValue) => {
                    const selectedBuyer = buyers.find(
                      (b) => b.value === currentValue
                    );
                    if (!selectedBuyer) return;

                    const { label: name, location } = selectedBuyer;

                    // якщо клік по вже вибраному — скинути
                    if (activeValue === currentValue) {
                      onSellerChange(null);
                    } else {
                      onSellerChange({ name, location });
                    }

                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      activeValue === buyer.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {/* тут саме те, що ти хотів */}
                  {buyer.label} ({buyer.location})
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
