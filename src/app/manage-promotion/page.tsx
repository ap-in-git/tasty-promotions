import React from 'react';
import Navbar from "@/components/navbar";
import {createClient} from "@/lib/supabase/server";
import ManagePromotion from "@/components/manage-promotion/ManagePromotion";
const Page = async () => {

    const supabase = await createClient()
    const { data } = await  supabase.auth.getUser()

    return (
        <div className={"p-8"}>
            <Navbar/>
            <ManagePromotion userId={data.user?.id || ""}/>
        </div>
    );
};

export default Page;