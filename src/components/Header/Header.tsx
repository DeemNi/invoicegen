'use client'

import React from 'react';

import Link from 'next/link';

import { FaFileInvoice } from "react-icons/fa";
import { RiUserLine, RiUserSettingsLine  } from "react-icons/ri";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/api/firebase";
import { useAuth } from '@/components/context/AuthContext';




export default function Header() {
    const { user } = useAuth();
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
                {user ? <RiUserSettingsLine fill='white' className='w-5 h-5' onClick={() => signOut(auth)}/> : <RiUserLine fill='white' className='w-5 h-5'/>}
                
            </div>
        </header>
    )
}