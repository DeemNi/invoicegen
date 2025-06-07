import React from 'react'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import InvoiceForm from '../InvoiceForm/InvoiceForm'

export default function WorkBoard() {
    return (
        <div className='min-h-screen flex flex-col'>
            <Header />
                <div className="flex-1">
                    <h1>Workboard</h1>
                    {/* <InvoiceForm /> */}
                </div>
            <Footer />
        </div>
    )
}