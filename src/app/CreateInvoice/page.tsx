'use client';

import React from 'react'

import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import SellerSearch from "./SellerSearch";
import ProductSelector from './ProductSelector';

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
  }
    
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
                <div className="flex flex-1 justify-center items-end pt-5">
                    <SellerSearch value={sellerChoise} onSellerChange={setSellerChoise}/>
                </div>                
                <div className="flex flex-1 justify-center pt-5">
                    <ProductSelector onSubmit={handleProductsSubmit}/>
                </div>

                <button onClick={() => {
                    console.log(sellerChoise),
                    console.log(productChoice)
                }}>test me sir</button>
            <Footer />
        </div>
    )
}