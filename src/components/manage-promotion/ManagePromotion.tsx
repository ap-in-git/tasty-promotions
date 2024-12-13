'use client';

import React, {useEffect} from "react";
import {createClient} from "@/lib/supabase/client";
import PromotionCard from "@/components/promotion-card";
import {RestaurantUser} from "@/app/auth/register/page";
import {PromotionResult} from "@/components/manage-bookmark/ManagePromotion";

interface Props {
    userId: string;
}



const ManageBookmark: React.FC<Props> =  ({ userId }) => {
    const [promotionResults, setPromotionResults] = React.useState<PromotionResult[]>([]);
    const [userLikes,setUserLikes] = React.useState<string[]>([])
    const supabase =  createClient()
    const fetchPromotions = async () => {
       const {data: userLikeData} =  await supabase.from('user_likes').select('*').eq('user_id',userId)
        if (userLikeData !== null){
            setUserLikes( userLikeData.map( f => f.promotion_id.toString()))
            let {data} =  await supabase.from('promotions').select('*')
            if (data !== null){
                for (const promotion of data ){
                    const user = await supabase.from('users').select('*').eq('user_id',promotion.user_id)
                    promotion.user = user.data?.[0] as RestaurantUser
                    const likedByResults = await supabase.from('user_likes').select('*').eq('promotion_id',promotion.id)
                    promotion.liked_by = likedByResults.data?.length
                }
                data = data.filter( f => {
                    if (userLikes?.includes(f.id.toString())){
                        return true
                    }
                    return  false
                })
                setPromotionResults(data)
            }
        }

    }
    useEffect(() => {
        fetchPromotions()
    },[])

    return (
        <div className="mt-4">
            {
                promotionResults.map((promotionResult, index) => <PromotionCard userLikes={userLikes} showBookmark={true} fetchPromotions={fetchPromotions} showAction={false} promotion={promotionResult} key={index}/>)
            }

        </div>
    );
};

export default ManageBookmark;