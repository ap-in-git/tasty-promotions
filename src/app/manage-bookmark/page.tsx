import React from 'react';
import Navbar from "@/components/navbar";
import {createClient} from "@/lib/supabase/server";
import ManageBookmark from "@/components/manage-bookmark/ManageBookmark";
const Page = async () => {

    const supabase = await createClient()
    const { data } = await  supabase.auth.getUser()

    return (
        <div className={"p-8"}>
            <Navbar/>
            <ManageBookmark userId={data.user?.id || ""}/>
        </div>
    );
};

export default Page;