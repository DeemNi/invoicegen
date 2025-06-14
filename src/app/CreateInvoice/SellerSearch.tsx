'use client'

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { getBuyer } from "@/lib/api/getBuyer"

type Props = {
    value: { name: string; location: string } | null;
    onSellerChange: (value: { name: string; location: string } | null) => void;
}

export default function SellerSearch({onSellerChange, value} : Props) {

  const [open, setOpen] = React.useState(false)
  const [buyers, setBuyers] = React.useState<{ value: string; label: string; location: string }[]>([]);

  React.useEffect(() => {
    const fetchBuyers = async () => {
        const data = await getBuyer();
        const formattedData = data.map(buyer => ({
            value: buyer.name,
            label: buyer.name || 'Невідомий покупець',
            location: buyer.location || 'Невідомий покупець'
        }))
        setBuyers(formattedData)
    }
    fetchBuyers();
  },[])


    return(
        <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[300px] justify-between"
          >
            <span
              className="block max-w-[230px] overflow-hidden text-ellipsis whitespace-nowrap"
              title={value?.name ?? "Оберіть покупця..."}
            >
              {value?.name
                ? buyers.find((buyer) => buyer.value === value.name)?.label
                : "Оберіть покупця..."}
            </span>
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0"> {/* Розмір випадаючого вікна селектбоксу */}
        <Command>
          <CommandInput placeholder="Оберіть покупця..." />
          <CommandList>
            <CommandEmpty>Покупець не знайдений.</CommandEmpty>
            <CommandGroup>
              {buyers.map((buyer) => (
                <CommandItem
                  key={buyer.value}
                  value={buyer.value}
                  onSelect={(currentValue) => {
                    const selectedBuyer = buyers.find((b) => b.value === currentValue);
                    if (!selectedBuyer) return;
                    
                    onSellerChange(currentValue === value?.name ? null: {name: currentValue, location: selectedBuyer.location})
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value?.name === buyer.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {buyer.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
        </>
    )
}


