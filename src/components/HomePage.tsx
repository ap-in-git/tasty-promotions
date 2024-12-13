'use client';

import React, {Fragment, useEffect} from 'react';
import {Search} from "lucide-react";
import {Button} from "@/components/ui/button";
import {foodTags} from "@/lib/constant";
import {createClient} from "@/lib/supabase/client";
import {RestaurantUser} from "@/app/auth/register/page";
import {PromotionResult} from "@/components/manage-promotion/ManagePromotion";
import PromotionCard from "@/components/promotion-card";

const HomePage : React.FC<{
    userId: string;
}>= ({userId}) => {

    const supabase =  createClient()
    const [originalPromotions, setOriginalPromotions] = React.useState<PromotionResult[]>([]);
    const [filteredPromotions, setFilteredPromotions] = React.useState<PromotionResult[]>([]);
    const [userLikes,setUserLikes] = React.useState<string[]>([])

    const [selectedTags, setSelectedTags] = React.useState<string[]>([])


    const fetchPromotions = async () => {
        const {data} =  await supabase.from('promotions').select('*')
        if (data !== null){
            for (const promotion of data ){
                const user = await supabase.from('users').select('*').eq('user_id',promotion.user_id)
                promotion.user = user.data?.[0] as RestaurantUser

                const likedByResults = await supabase.from('user_likes').select('*').eq('promotion_id',promotion.id)
                promotion.liked_by = likedByResults.data?.length

            }
            setOriginalPromotions(data)
            setFilteredPromotions(data)
        }
    }
    const fetchUserLikes = async () => {
        if (!userId){
            return
        }
        const {data} =  await supabase.from('user_likes').select('*').eq('user_id',userId)
        if (data !== null){
            const ll = data.map( f => f.promotion_id)  as string[]
            setUserLikes(ll)
        }
    }

    const filterPromotionsByTag = (promotionTag: string) => {
        const promotins = [...originalPromotions].filter( op => {
            if (op.user?.tags?.includes(promotionTag)){
                return true
            }
            return false
        })
        if (selectedTags.includes(promotionTag)){
            setSelectedTags(selectedTags.filter(tag => tag !== promotionTag))
        }else{
            setSelectedTags([...selectedTags, promotionTag])
        }
        setFilteredPromotions(promotins)
    }
    useEffect(() => {
        fetchPromotions()
        fetchUserLikes()
    },[])

    return (
        <Fragment>
            <div className="mt-6 flex items-center w-full max-w-md mx-auto">
                <div className="relative w-full">
                    <input
                        type="text"
                        placeholder="Search restaurants,..."
                        onChange={(e) => {
                            const value = e.target.value;
                            const promotions = originalPromotions.filter( f => {
                                if (f.user?.restaurant_name?.toLowerCase().includes(value.toLowerCase())){
                                    return true
                                }
                                if (f.user?.tags.map(tag => tag.toLowerCase()).includes(value.toLowerCase())){
                                    return true
                                }
                                return false
                            })
                            setFilteredPromotions(promotions)
                        }}
                        className="w-full py-2 pl-10 pr-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="w-5 h-5 text-gray-400"/>
                    </div>
                </div>
            </div>
            <div className={"flex gap-2 mt-2"}>
                {foodTags.map((tag) => (
                    <Button
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"} // Different style for selected tags
                        size="sm"
                        className={`${
                            selectedTags.includes(tag)
                                ? "bg-blue-500 text-white" // Selected color
                                : "bg-gray-200 text-black" // Default color
                        } flex items-center`} // Classname to align text and icon
                        onClick={() => filterPromotionsByTag(tag)}
                    >
                        {tag}
                        {selectedTags.includes(tag) && (
                            <span
                                className="ml-2 text-inherit cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent triggering parent onClick
                                    filterPromotionsByTag(tag);
                                }}
                            >
                            ✕ {/* Cross icon */}
                        </span>
                        )}
                    </Button>
                ))}

            </div>
            <div className={"flex gap-4 mt-4"}>
                {
                    filteredPromotions.map((promotionResult, index) => <div key={index}><PromotionCard showBookmark={true} userLikes={userLikes} userId={userId} promotion={promotionResult} showAction={false}/></div>)
                }

            </div>
        </Fragment>
    );
};

export default HomePage;