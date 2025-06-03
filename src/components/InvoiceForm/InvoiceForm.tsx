'use client'

import { getBuyer } from '@/lib/api/getBuyer';
import { getProducts } from '@/lib/api/getProducts';
import React from 'react';

import { useForm, useFieldArray } from "react-hook-form";

export default function InvoiceForm() {

    const { register, handleSubmit, control } = useForm({
        defaultValues: {
            invoiceNumber: '',
            supplier: '',
            items: [{
                name: '',
                quantity: 1,
                price: 0
            }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'items'
    });

    const onSubmit = (data: any) => {
        console.log('Invoice data: ', data)
    };



    return (
        <div className='border-amber-600'>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col justify-center items-center'>
                <input {...register('invoiceNumber')} placeholder='Invoice Number'/>
                <input {...register('supplier')} placeholder='Supplier'/>

                {
                    fields.map((item, index) => (
                        <div key={item.id} className='flex flex-col'>
                            <input {...register(`items.${index}.name`)} placeholder='Item name'/>
                            <input type='number' {...register(`items.${index}.quantity`)} placeholder='quantity' />
                            <input type='number' {...register(`items.${index}.price`)} placeholder='price' />
                            <button type='button' onClick={() => remove(index)}>❌</button>
                        </div>
                    ))
                }

                <button type='button' onClick={() => append({name: '', quantity: 1, price: 0})}>
                    ➕ Add Item
                </button>

                <button type='submit'>✅ Submit Invoice</button>
            </form>

            <button className='bg-cyan-400 p-5 rounded-2xl hover:bg-red-500 hover:text-white'>TEST BUTTON</button>
        </div>
    )
}