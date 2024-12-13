import React from 'react';
import Navbar from "@/components/navbar";
import HomePage from "@/components/HomePage";
import {createClient} from "@/lib/supabase/server";
const Page = async  () => {

    const supabase = await createClient()
    const { data } = await  supabase.auth.getUser()

    return (
        <div className={"p-8"}>
            <Navbar/>
            <HomePage userId={data.user?.id || ""}/>
        </div>
    );
};

export default Page;