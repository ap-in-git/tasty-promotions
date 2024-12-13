import React, {Fragment} from 'react';
import Image from "next/image";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {createClient} from "@/lib/supabase/server";
import {LogoutButton} from "@/components/LogoutButton";

const Navbar =async () => {
    const supabase = await createClient()
    const { data } = await  supabase.auth.getUser()



    return (
        <div className={"flex justify-between items-center"}>
            <Link href={"/"}>
                <div className="flex items-center">
                    <Image src={"/tasty-minimal.png"} width={32} height={32} alt={"tasty logo"}/>
                    <h1 className="text-3xl font-bold text-red-500 ml-2">
                        Tasty Promotions
                    </h1>
                </div>
            </Link>
            <div className="flex  gap-2 justify-end w-5/12 ">
                {
                    data.user === null && <Fragment>
                        <Button variant="outline" asChild>
                            <Link href={"/auth/login"}>Login</Link>
                        </Button>
                        <Button variant="secondary">
                            <Link href={"/auth/register"}>Sign up</Link>
                        </Button>
                    </Fragment>
                }
                {
                    data.user !== null && data.user.user_metadata.user_type === 'Restaurant' && <Fragment>
                        <Button variant="outline">
                            <Link href={"/manage-promotion"}>Manage your promotions</Link>
                        </Button>
                       <LogoutButton/>
                    </Fragment>
                }
                {
                    data.user !== null && data.user.user_metadata.user_type === 'Foodie' && <Fragment>
                        <Button variant="outline">
                            <Link href={"/manage-bookmark"}>Dig Into Your Tasty Promotions</Link>
                        </Button>
                       <LogoutButton/>
                    </Fragment>
                }
            </div>
        </div>
)
    ;
};

export default Navbar;