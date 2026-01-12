'use client'

import React from 'react'
import { v4 as uuidv4 } from 'uuid'
import { XIcon, CheckIcon, ChevronsUpDownIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Command, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { getProducts } from '@/lib/api/getProducts'

type ProductRow = {
  rowUUID: string
  id: string
  name: string
  value: number
  quantity: number
  EAN_code: string
}

type Product = { id: string; name: string; value: number; EAN_code: string }

export default function ProductSelector({ onSubmit }: { onSubmit: (products: ProductRow[]) => void }) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null)
  const [rows, setRows] = React.useState<ProductRow[]>([])
  const [products, setProducts] = React.useState<Product[]>([])
  const [errorIndex, setErrorIndex] = React.useState<number | null>(null)

  React.useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts()
      const formattedData: Product[] = data.map((product: any) => ({
        id: product.id,
        name: product.name || 'Продукт не знайдено',
        value: product.price || 0,
        EAN_code: product.EAN_code || '',
      }))
      setProducts(formattedData)
    }
    fetchProducts()
  }, [])

  const handleAddRow = () => {
    if (rows.length > 0) {
      const lastRow = rows[rows.length - 1]
      if (!lastRow.name) {
        setErrorIndex(rows.length - 1)
        return
      }
    }
    setRows((prev) => [
      ...prev,
      { rowUUID: uuidv4(), id: '', name: '', EAN_code: '', value: 0, quantity: 1 },
    ])
    setErrorIndex(null)
  }

  const handleUpdateRow = (index: number, newData: Partial<ProductRow>) => {
    setRows((prevRows) => {
      const updated = [...prevRows]
      updated[index] = { ...updated[index], ...newData }
      return updated
    })
  }

  const handleDeleteRow = (index: number) => {
    setRows((prevRows) => prevRows.filter((_, i) => i !== index))
    setOpenIndex((cur) => (cur === index ? null : cur))
    setErrorIndex((cur) => (cur === index ? null : cur))
  }

  const handleSubmit = () => {
    const validRows = rows.filter((row) => row.id && row.quantity > 0)
    onSubmit(validRows)
  }

  const selectedIds = rows.map((row) => row.id).filter(Boolean)

  return (
    <div className="w-full">
      {/* ✅ красивий контейнер: центр + відступи */}
      <div className="mx-auto w-full max-w-md px-4 py-4 space-y-4">
        {/* rows */}
        <div className="space-y-3">
          {rows.map((row, index) => (
            <div
              key={row.rowUUID}
              className="rounded-xl border bg-white/50 p-3 shadow-sm"
            >
              <div className="grid grid-cols-12 gap-2 items-center">
                {/* selector */}
                <div className="col-span-8">
                  <Popover
                    open={openIndex === index}
                    onOpenChange={(open) => setOpenIndex(open ? index : null)}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-between',
                          errorIndex === index && 'border-red-500 text-red-500'
                        )}
                      >
                        <span className="truncate">
                          {row.name ||
                            (errorIndex === index
                              ? 'Будь ласка, оберіть продукт'
                              : 'Оберіть продукт')}
                        </span>
                        <ChevronsUpDownIcon className="ml-2 h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>

                    {/* ✅ адаптивна ширина поповера */}
                    <PopoverContent className="p-0 w-[92vw] max-w-md" align="start">
                      <Command>
                        <CommandInput placeholder="Пошук продукту..." />
                        <CommandList className="max-h-[45vh] overflow-y-auto">
                          {products.map((p) => {
                            const isSelected = selectedIds.includes(p.id)
                            const isDisabled = isSelected && rows[index].id !== p.id

                            return (
                              <CommandItem
                                key={p.id}
                                value={p.name}
                                disabled={isDisabled}
                                onSelect={() => {
                                  if (isDisabled) return
                                  setOpenIndex(null)
                                  handleUpdateRow(index, {
                                    id: p.id,
                                    name: p.name,
                                    value: p.value,
                                    EAN_code: p.EAN_code,
                                  })
                                  setErrorIndex(null)
                                }}
                                className={cn(
                                  'py-2 items-start',
                                  isDisabled ? 'opacity-50 line-through cursor-not-allowed' : '',
                                  rows[index].id === p.id ? 'font-semibold' : ''
                                )}
                              >
                                <CheckIcon
                                  className={cn(
                                    'mr-2 h-4 w-4 mt-1',
                                    rows[index].id === p.id ? 'opacity-100' : 'opacity-0'
                                  )}
                                />
                                {/* ✅ перенос тексту на 2+ рядки */}
                                <span className="block whitespace-normal break-words leading-snug">
                                  {p.name}
                                </span>
                              </CommandItem>
                            )
                          })}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* quantity */}
                <div className="col-span-3">
                  <Input
                    type="number"
                    value={row.quantity}
                    min={1}
                    onChange={(e) => handleUpdateRow(index, { quantity: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>

                {/* delete */}
                <div className="col-span-1 flex justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteRow(index)}
                    className="h-9 w-9"
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ buttons block */}
        <div className="pt-2 flex flex-col gap-3 sm:flex-row sm:justify-center sm:items-center">
          <Button onClick={handleAddRow} className="w-full sm:w-auto">
            Додати продукт
          </Button>
          <Button variant="secondary" onClick={handleSubmit} className="w-full sm:w-auto">
            Створити накладну
          </Button>
        </div>
      </div>
    </div>
  )
}
