'use client';

import React from 'react'

import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import SellerSearch from "./SellerSearch";



export default function CreateInvoice() {
    
    const [sellerChoise, setSellerChoise] = React.useState<string | null>(null);
    
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
                <div className="flex flex-1 justify-center pt-5">
                    <SellerSearch value={sellerChoise} onSellerChange={setSellerChoise}/>
                </div>

                <button onClick={() => console.log(sellerChoise)}>test me sir</button>
            <Footer />
        </div>
    )
}