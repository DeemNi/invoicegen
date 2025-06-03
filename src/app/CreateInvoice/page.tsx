import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import SellerSearch from "./SellerSearch";



export default function CreateInvoice() {
    
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
                <div className="flex flex-1">
                    <SellerSearch />
                </div>
            <Footer />
        </div>
    )
}