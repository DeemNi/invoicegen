'use client';

import React from 'react'

import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import SellerSearch from "./SellerSearch";
import ProductSelector from './ProductSelector';
import { addInvoiceData } from '@/lib/api/addInvoiceData';


type ProductItem = {
    id: string;
    name: string;
    value: number;
    quantity: number;
}


export default function CreateInvoice() {
    
    const [sellerChoise, setSellerChoise] = React.useState<string | null>(null);
    const [productChoice, setProductChoice] = React.useState<ProductItem[]>([]);

      const handleProductsSubmit = (products:ProductItem[]) => {
        setProductChoice(products)

        // const newInvoiceData = {
        //     buyer_name: 
        // }
        // addInvoiceData()
        console.log(sellerChoise, productChoice)
    }
    
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
                <div className="flex flex-col flex-1  gap-8 justify-center items-center pt-5">
                    <SellerSearch value={sellerChoise} onSellerChange={setSellerChoise}/>
                    {sellerChoise && <ProductSelector onSubmit={handleProductsSubmit} />}
                </div>                
            <Footer />
        </div>
    )
}