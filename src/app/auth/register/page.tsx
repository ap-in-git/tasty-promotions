"use client"
import React, {Fragment, useState} from "react";
import { useForm, Controller } from "react-hook-form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {signup} from "@/app/auth/register/action";
import {Checkbox} from "@/components/ui/checkbox";
import {foodTags, RestaurantUser, UserType} from "@/lib/constant";







const RegistrationForm: React.FC = () => {
    const [userType, setUserType] = useState<UserType>("Foodie");

    const {
        register,
        control,
        watch,
        setValue,
        formState: { errors },
        handleSubmit
    } = useForm<RestaurantUser>({
        defaultValues: {
            first_name: "",
            last_name: "",
            password:"",
            email: "",
            user_type: "Foodie",
            restaurant_name: "",
            sign_up_for_newsletter: false,
            tags: []
        },
    });

    const selectedTags = watch("tags"); // Watch the current tags array

    const handleCheckboxChange = (tag: string, checked: boolean) => {
        setValue(
            "tags",
            checked
                ? [...selectedTags, tag] // Add tag if checked
                : selectedTags.filter((t) => t !== tag) // Remove tag if unchecked
        );
    };
    // This will handle form submission
    const onSubmit = async (formData: RestaurantUser) => {
        try {
            // Call the `signup` action with formData
            await signup(formData);
            console.log("Registration successful:", formData);
        } catch (error) {
            console.error("Registration failed:", error);
        }
    };

    return (
        <div className={"flex h-screen items-center justify-center w-screen"}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="max-w-lg mx-auto bg-white p-6 shadow-md rounded-lg "
            >
                <h1 className="text-xl font-bold text-red-500 text-center mb-4 " style={{width: 430}}>
                    {
                        userType === "Foodie" ? "Sign Up for Your Daily Dose of Deliciousness" : 'Join Now and Let the Foodies Find You!'
                    }
                </h1>
                <div className="flex items-center justify-center mb-6">
                    <div className="relative rounded flex items-center bg-gray-100 p-2 w-full">
                        <button
                            type="button"
                            onClick={() => setUserType("Foodie" as UserType)}
                            className={`w-1/2 py-2 text-sm font-medium rounded transition-all duration-300 ${
                                userType === "Foodie"
                                    ? "bg-white shadow-md  text-black"
                                    : "text-gray-600"
                            }`}
                        >
                            Foodie
                        </button>
                        <button
                            type="button"
                            onClick={() => setUserType("Restaurant" as UserType)}
                            className={`w-1/2 py-2 text-sm font-medium rounded transition-all duration-300 ${
                                userType === "Restaurant"
                                    ? "bg-white shadow-md text-black"
                                    : "text-gray-600"
                            }`}
                        >
                            Restaurant Owner
                        </button>
                    </div>
                </div>

                {/* First Name */}
                <div className="mb-4">
                    <Input type="text"
                           placeholder={"First Name"}
                           id="firstName"
                           {...register("first_name", {required: "First name is required"})} />
                    {errors.first_name && (
                        <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>
                    )}
                </div>

                {/* Last Name */}
                <div className="mb-4">
                    <Input type={"text"}
                           id="lastName"
                           placeholder={"Last Name"}
                           {...register("last_name", {required: "Last name is required"})}
                           className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                    </Input>

                    {errors.last_name && (
                        <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>
                    )}
                </div>
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


                {userType === "Restaurant" && (
                    <Fragment>

                    <div className="mb-4">
                        <Input
                            placeholder={"Restaurant Name"}
                            type="text"
                            id="restaurantName"
                            {...register("restaurant_name", {
                                required: "Restaurant name is required for restaurants",
                            })}
                        >
                        </Input>
                        {errors.restaurant_name && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.restaurant_name.message}
                            </p>
                        )}
                    </div>
                        <div className="mb-4">
                            <label htmlFor="foodTags" className="text-sm font-medium">
                                Food Tags
                            </label>
                            <div className="mt-1">
                                {foodTags.map((tag) => (
                                    <Controller
                                        key={tag}
                                        name="tags"
                                        control={control}
                                        render={() => (
                                            <div className="flex items-center">
                                                <Checkbox
                                                    id={tag}
                                                    checked={selectedTags.includes(tag)} // Controlled checked state
                                                    onCheckedChange={(checked) => handleCheckboxChange(tag, checked as boolean)}
                                                />
                                                <label htmlFor={tag} className="ml-2">
                                                    {tag}
                                                </label>
                                            </div>
                                        )}
                                    />
                                ))}
                            </div>
                        </div>

                    </Fragment>
                )}

                <Button variant={"secondary"} type={"submit"} className={"w-full"}>
                    Register
                </Button>
            </form>
        </div>

    );
};

export default RegistrationForm;