import React, {useState} from 'react';
import {BookHeart, Calendar, Heart} from 'lucide-react';
import dayjs from "dayjs";
import {Button} from "@/components/ui/button";
import {createClient} from "@/lib/supabase/client";
import {PromotionResult} from "@/lib/constant"; // Add required icons


const PromotionCard: React.FC<{
    promotion: PromotionResult;
    showAction: boolean
    fetchPromotions?: () => Promise<void>
    userLikes?: string[]
    userId?: string;
    showBookmark: boolean;
}> = ({promotion,fetchPromotions,showAction,userId,userLikes,showBookmark}) => {
    const formattedDate = dayjs(promotion.valid_till).format("hh:mm A, D MMM");
    const supabase =  createClient()
    // State for bookmark/love icon
    const [isBookmarked, setIsBookmarked] = useState(userLikes?.includes(promotion.id.toString()) ?? false);

    const toggleBookmark = async () => {
        if (!userId) {
            alert('Please login to bookmark this promotion');
            return
        };

        try {
            if (!isBookmarked) {
                // Add to Supabase
                const { error } = await supabase.from('user_likes').insert({
                    user_id: userId,
                    promotion_id: promotion.id,
                });
                if (error) throw error;
            } else {
                // Remove from Supabase
                const { error } = await supabase
                    .from('user_likes')
                    .delete()
                    .eq('user_id', userId)
                    .eq('promotion_id', promotion.id);
                if (error) throw error;
            }

            setIsBookmarked(!isBookmarked);
        } catch (error) {
            console.error("Error updating bookmark:", error);
        }

        setIsBookmarked(!isBookmarked);
    };

    const imageUrl = `https://gpcyhdrfquanczengbui.supabase.co/storage/v1/object/public/offers/${promotion.image_url}`

    const deletePromotion = async () => {
        if (confirm('Are you sure ?') && fetchPromotions){
            await supabase
                .from("promotions").delete()
                .eq('id', promotion.id)


            fetchPromotions()
        }
    }



    return (
        <div className="max-w-md mx-auto overflow-hidden bg-white rounded-lg shadow-md" style={{width: 400}}>
            {/* Image Container */}
            <div className="relative">
                {/* Promotion Image */}
                <img
                    className="w-full h-48 object-cover"
                    src={imageUrl} // Using the imageSrc variable here
                    alt="Promotion"
                />

                {
                    showBookmark && <button
                        onClick={toggleBookmark}
                        className="absolute top-2 left-2 text-gray-200 hover:text-red-500 transition-colors"
                        aria-label="Bookmark"
                    >
                        <Heart
                            className={`w-6 h-6 ${isBookmarked ? 'text-red-500' : 'text-gray-200'}`}
                            fill={isBookmarked ? 'currentColor' : 'none'}
                        />
                    </button>
                }

                {/* Discount Overlay */}
                <span
                    className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold py-1 px-3 rounded-full shadow">
                    {promotion.discount_value}{promotion.discount_type} OFF
                </span>
            </div>

            {/* Content Section */}
            <div className="p-6">
                {/* Promotion Name */}
                <h2 className="text-2xl font-bold text-gray-800">
                    {promotion.discount_title}
                </h2>

                {/* Restaurant Name */}
                <p className="text-sm text-gray-500 mt-1">by {promotion.user?.restaurant_name}  Restaurant</p>

                {/* Promotion Description */}
                <p className="mt-4 text-gray-600">
                    {promotion.description}
                </p>

                <div className="mt-4 flex items-center justify-between text-gray-500">
                    {/* Offer Validity */}
                    <div className="flex items-center">
                        <BookHeart className="w-5 h-5 text-gray-500 mr-2"/>
                        <span className="text-sm text-gray-600 font-bold">
                            {promotion.liked_by}
                       </span>
                    </div>
                    <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-gray-500 mr-2"/>
                        <span className="text-sm text-gray-600 font-medium">
                          {/*Valid Till: 10:00 PM, 31st Dec*/}
                          Valid Till: {formattedDate}
                       </span>
                    </div>
                </div>

                {
                    showAction &&
                    <div className={"mt-2 flex gap-2 justify-end"}>
                        <Button variant={"destructive"} onClick={deletePromotion}>Delete</Button>
                    </div>
                }

            </div>
        </div>
    );
};


export default PromotionCard;