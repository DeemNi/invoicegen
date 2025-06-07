'use client'

import React from 'react';

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { XIcon } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid';

import { Command, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getProducts } from '@/lib/api/getProducts';

type ProductRow = {
  rowUUID: string;    // унікальний для рядка
  id: string;         // айді продукту
  name: string;
  value: number;
  quantity: number;
}

export default function ProductSelector({ onSubmit } : { onSubmit: (products: ProductRow[]) => void}) {
    const [openIndex, setOpenIndex] = React.useState<number | null>(null);
    const [rows, setRows] = React.useState<ProductRow[]>([]);
    const [products, setProducts] = React.useState<{id: string, name: string, value:number}[]>([]);
    const [errorIndex, setErrorIndex] = React.useState<number | null>(null);

    React.useEffect(() => {
        const fetchProducts = async () => {
            const data = await getProducts();
            const formattedData = data.map(product => ({
                id: product.id,
                name: product.name || 'Продукт не знайдено',
                value: product.price || 0
            }));
            setProducts(formattedData);
        };
        fetchProducts();
    }, []);

    const handleAddRow = () => {
        if (rows.length > 0) {
            const lastRow = rows[rows.length - 1];
            if (!lastRow.name) {
                setErrorIndex(rows.length - 1);
                return;
            }
        }
        setRows(prev => [
            ...prev,
            { rowUUID: uuidv4(), id: '', name: '', value: 0, quantity: 1 }
        ]);
        setErrorIndex(null);
    };

    const handleUpdateRow = (index: number, newData: Partial<ProductRow>) => {
        setRows(prevRows => {
            const updated = [...prevRows];
            updated[index] = { ...updated[index], ...newData };
            return updated;
        });
    };

    const handleDeleteRow = (index: number) => {
        setRows(prevRows => prevRows.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        const validRows = rows.filter(row => row.id && row.quantity > 0);
        onSubmit(validRows);
    };

    // Масив id вже вибраних продуктів
    const selectedIds = rows.map(row => row.id).filter(Boolean);

    return (
        <div className="space-y-4">
            {rows.map((row, index) => (
                <div key={row.rowUUID} className="flex items-center gap-2">
                    <Popover open={openIndex === index} onOpenChange={open => setOpenIndex(open ? index : null)}>
                        <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "sm md:w-md justify-between",
                                errorIndex === index && "border-red-500 text-red-500"
                              )}
                            >
                              <span className="block max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap sm:max-w-full">
                                {row.name || (errorIndex === index ? "Будь ласка, оберіть продукт" : "Оберіть продукт")}
                              </span>
                              <ChevronsUpDownIcon className="ml-2 h-4 w-4 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-[500px]">
                            <Command>
                                <CommandInput placeholder="Оберіть продукт..." />
                                <CommandList>
                                    {products.map(p => {
                                        const isSelected = selectedIds.includes(p.id);
                                        // Дозволяємо вибрати, якщо це поточний рядок (щоб мати можливість змінювати вибір)
                                        const isDisabled = isSelected && rows[index].id !== p.id;

                                        return (
                                            <CommandItem
                                                key={p.id}
                                                value={p.name}
                                                disabled={isDisabled}
                                                onSelect={() => {
                                                  if (isDisabled) return;
                                                  setOpenIndex(null);
                                                  handleUpdateRow(index, {
                                                    id: p.id,
                                                    name: p.name,
                                                    value: p.value,
                                                  });
                                                  setErrorIndex(null);
                                                }}
                                                className={cn(
                                                  isDisabled ? 'opacity-50 line-through cursor-not-allowed' : '',
                                                  rows[index].id === p.id ? 'font-semibold' : ''
                                                )}
                                              >
                                                <CheckIcon
                                                  className={cn(
                                                    'mr-2 h-4 w-4',
                                                    rows[index].id === p.id ? 'opacity-100' : 'opacity-0'
                                                  )}
                                                />
                                                <span className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap block">
                                                  {p.name}
                                                </span>
                                              </CommandItem>
                                        );
                                    })}
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>

                    <Input
                        type="number"
                        value={row.quantity}
                        min={1}
                        onChange={e => handleUpdateRow(index, { quantity: Number(e.target.value) })}
                        className="w-[80px]"
                    />

                    <Button variant="ghost" size="icon" onClick={() => handleDeleteRow(index)}>
                        <XIcon className="h-4 w-4" />
                    </Button>
                </div>
            ))}

            <div className="flex gap-4">
                <Button onClick={handleAddRow}>Додати продукт</Button>
                <Button variant="secondary" onClick={handleSubmit}>Створити накладну</Button>
            </div>
        </div>
    );
}
