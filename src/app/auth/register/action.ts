'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {createClient} from "@/lib/supabase/server";
import {RestaurantUser} from "@/lib/constant";




export async function signup(formData: RestaurantUser) {
    const supabase = await createClient()


    const {error,data:signUpData} = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
            data: formData
        }
    })

    if (error) {
        redirect('/error')
    }
    if (signUpData.user?.id === null) {
        return
    }

    formData.user_id = signUpData.user?.id || ""
    const inserData = {...formData} as Partial<RestaurantUser>
    delete inserData['password']

    await supabase
        .from('users')
        .insert(inserData)


    const result = await supabase.auth.signInWithPassword({
         email: formData.email,
         password: formData.password,
     })

    revalidatePath('/', 'layout')
    redirect('/')
}