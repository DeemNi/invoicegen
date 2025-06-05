'use client';

import React from 'react'

import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import SellerSearch from "./SellerSearch";
import ProductSelector from './ProductSelector';
import { addInvoiceData, InvoiceData } from '@/lib/api/addInvoiceData';


type ProductItem = {
    id: string;
    name: string;
    value: number;
    quantity: number;
}


export default function CreateInvoice() {
    
    const [sellerChoice, setSellerChoice] = React.useState<{ name: string; location: string } | null>(null);
    const [productChoice, setProductChoice] = React.useState<ProductItem[]>([]);

      const handleProductsSubmit = async (products:ProductItem[]) => {
        setProductChoice(products)

    const newInvoiceData: InvoiceData = {
        buyer_name: sellerChoice?.name || '',
        buyer_addr: sellerChoice?.location || '',
        product_data: products,
    };

    const result = await addInvoiceData(newInvoiceData);

      if (result.success) {
        setSellerChoice(null);
        setProductChoice([]);
    } else {
    console.error('Помилка при створенні накладної', result.error);
  }
    }
    
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
                <div className="flex flex-col flex-1  gap-8 justify-center items-center pt-5">
                    <SellerSearch value={sellerChoice} onSellerChange={setSellerChoice}/>
                    {sellerChoice && <ProductSelector onSubmit={handleProductsSubmit} />}
                </div>                
            <Footer />
        </div>
    )
}