'use client';

import React, {useEffect} from "react";
import {createClient} from "@/lib/supabase/client";
import PromotionCard from "@/components/promotion-card";
import {PromotionResult, RestaurantUser} from "@/lib/constant";
import {SubmitHandler, useForm} from "react-hook-form";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "../ui/dialog";
import { Button } from "../ui/button";
import {Input} from "@/components/ui/input";

interface Props {
    userId: string;
}

type FormData = {
    discountTitle: string;
    discountType: string;
    discountValue: string;
    description: string;
    validTill: string;
    promotionImage: FileList;
};



const ManagePromotion: React.FC<Props> =  ({ userId }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
    const [promotionResults, setPromotionResults] = React.useState<PromotionResult[]>([]);
    const [userLikes,setUserLikes] = React.useState<string[]>([])
    const supabase =  createClient()
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const fetchPromotions = async () => {
       const {data} =  await supabase.from('promotions').select('*').eq('user_id', userId)
        if (data !== null){
            for (const promotion of data ){
                const user = await supabase.from('users').select('*').eq('user_id',promotion.user_id)
                promotion.user = user.data?.[0] as RestaurantUser
                const likedByResults = await supabase.from('user_likes').select('*').eq('promotion_id',promotion.id)
                promotion.liked_by = likedByResults.data?.length
            }
            setPromotionResults(data)
        }
    }
    useEffect(() => {
        fetchPromotions()
    },[])

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            // Extract file (assuming a single file upload)
            const file = data.promotionImage[0];
            if (file) {
                // Upload file to Supabase storage
                const fileExtension = file.name.split(".").pop();
                const filePath = `${Date.now()}.${fileExtension}`;
                console.log(filePath)
                const { data: storageData, error: storageError } = await supabase.storage
                    .from("offers")
                    .upload(filePath, file);

                if (storageError) {
                    console.error("Error uploading file:", storageError.message);
                    alert("Failed to upload the promotion image.");
                    return;
                }

                // Save promotion data including file URL
                const { error: insertError } = await supabase
                    .from("promotions")
                    .insert({
                        user_id: userId,
                        discount_title: data.discountTitle,
                        discount_type: data.discountType,
                        discount_value: data.discountValue,
                        description: data.description,
                        valid_till: data.validTill,
                        image_url: storageData?.path, // Save the file path in the database
                    });

                if (insertError) {
                    console.error("Error saving promotion data:", insertError.message);
                    alert("Failed to save promotion data.");
                    return;
                }

                alert("Promotion saved successfully!");
                reset(); // Reset the form on successful submission
                setDialogOpen(false)
                fetchPromotions()
            } else {
                alert("Please upload a promotion image.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An unexpected error occurred.");
        }
    };



    return (
        <div className="mt-4">
            <div className="flex justify-end w-full">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                            <Button variant="outline">Add new promotion</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Manage your promotion here</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-2">
                            <div>
                                <Input
                                    {...register("discountTitle", { required: "Discount title is required" })}
                                    id="discount_title"
                                    placeholder="Discount title"
                                />
                                {errors.discountTitle && (
                                    <p className="text-red-500 text-sm">{errors.discountTitle.message}</p>
                                )}
                            </div>
                            <div className="flex items-center rounded-md border border-input focus-within:ring-1 focus-within:ring-ring">
                                <select
                                    {...register("discountType", { required: "Discount type is required" })}
                                    className="flex h-9 w-20 rounded-md rounded-r-none border border-t-0 border-r-0 border-b-0 bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                >
                                    <option value="$">$</option>
                                    <option value="%">%</option>
                                </select>
                                <input
                                    {...register("discountValue", { required: "Discount value is required" })}
                                    className="flex h-9 w-full rounded-md rounded-l-none border-0 bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                    placeholder="Discount value"
                                    id="discount_value"
                                />
                            </div>
                            {errors.discountValue && (
                                <p className="text-red-500 text-sm">{errors.discountValue.message}</p>
                            )}
                            <div>
                                <Input
                                    {...register("description", { required: "Description is required" })}
                                    id="description"
                                    placeholder="Discount description"
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-sm">{errors.description.message}</p>
                                )}
                            </div>
                            <div>
                                <Input
                                    {...register("validTill", { required: "Valid until date is required" })}
                                    id="valid_till"
                                    placeholder="Valid until"
                                    type="date"
                                />
                                {errors.validTill && (
                                    <p className="text-red-500 text-sm">{errors.validTill.message}</p>
                                )}
                            </div>
                            <div>
                                <Input
                                    {...register("promotionImage", { required: "Promotion image is required" })}
                                    id="file_image"
                                    type="file"
                                />
                                {errors.promotionImage && (
                                    <p className="text-red-500 text-sm">{errors.promotionImage.message}</p>
                                )}
                            </div>
                            <DialogFooter>
                                <Button type="submit">Create your promotion</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            <div className={"flex flex-col gap-4 mt-4"}>
                {
                    promotionResults.map((promotionResult, index) => <PromotionCard userLikes={userLikes} showBookmark={true} fetchPromotions={fetchPromotions} showAction={true} promotion={promotionResult} key={index}/>)
                }
            </div>

        </div>
    );
};

export default ManagePromotion;