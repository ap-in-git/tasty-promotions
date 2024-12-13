"use client"
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {login} from "@/app/auth/login/action";
import Link from "next/link";


interface FormData {
    password: string;
    email: string;
}

const RegistrationForm: React.FC = () => {
    const {
        register,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            password:"",
            email: "",
        },
    });


    return (
        <div className={"flex h-screen items-center justify-center w-screen"}>
            <form
                action={login}
                // onSubmit={handleSubmit(onSubmit)}
                className="max-w-lg mx-auto bg-white p-6 shadow-md rounded-lg "
            >
                <h1 className="text-xl font-bold text-red-500 text-center mb-4 " style={{width: 430}}>
                    Sign In
                </h1>

                {/* Email */}
                <div className="mb-4">
                    <Input
                        placeholder={"Email"}
                        type="email"
                        id="email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Invalid email address",
                            },
                        })}
                    >
                    </Input>
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                </div>

                <div className="mb-4">
                    <Input
                        placeholder={"password"}
                        type="password"
                        id="password"
                        {...register("password", {
                            required: "Password is required",
                        })}
                    >
                    </Input>
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                    )}
                </div>

                <Button variant={"secondary"} type={"submit"} className={"w-full mb-2"}>
                    Sign In
                </Button>
                <Button variant={"outline"}  className={"w-full"} asChild>
                    <Link href={"/auth/register"}>Register</Link>
                </Button>
            </form>
        </div>

    );
};

export default RegistrationForm;