import React from 'react';

import Link from 'next/link';

import { FaFileInvoice } from "react-icons/fa";
import { RiUserLine, RiUserSettingsLine  } from "react-icons/ri";




export default function Header() {
    const isAdmin = false;
    return (
        <header className={`bg-gray-800 p-4 flex justify-between`}>
            <div className='flex items-center gap-4'>
                <FaFileInvoice className='w-5 h-5' fill='white'/>
                <h1 className='text-white'>InvoiceGen</h1>
            </div>
            <div className='flex items-center text-white gap-5'>
                <Link href='/'>Home</Link>
                <Link href='/InvoiceData'>Invoice Data</Link>
                <Link href='/CreateInvoice'>Create Invoice</Link>
                {isAdmin ? <RiUserSettingsLine fill='white' className='w-5 h-5'/> : <RiUserLine fill='white' className='w-5 h-5'/>}
            </div>
        </header>
    )
}