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
    value: string | null;
    onSellerChange: (value: string | null) => void;
}

export default function SellerSearch({onSellerChange, value} : Props) {

  const [open, setOpen] = React.useState(false)
  const [buyers, setBuyers] = React.useState<{value: string, label: string}[]>([])

  React.useEffect(() => {
    const fetchBuyers = async () => {
        const data = await getBuyer();
        const formattedData = data.map(buyer => ({
            value: buyer.name,
            label: buyer.name || 'Unknown Buyer'
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
          className="w-[300px] justify-between" // Розмір селектбокса
        >
          {value
            ? buyers.find((buyer) => buyer.value === value)?.label
            : "Оберіть покупця..."}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0"> {/* Розмір випадаючого вікна селектбоксу */}
        <Command>
          <CommandInput placeholder="Оберіть покупця..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {buyers.map((buyer) => (
                <CommandItem
                  key={buyer.value}
                  value={buyer.value}
                  onSelect={(currentValue) => {
                    onSellerChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === buyer.value ? "opacity-100" : "opacity-0"
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


