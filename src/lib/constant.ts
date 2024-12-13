
export type UserType = "Restaurant" | "Foodie";

export interface RestaurantUser {
    user_id?: string
    first_name: string;
    last_name: string;
    password: string;
    email: string;
    user_type: UserType;
    restaurant_name?: string;
    sign_up_for_newsletter?: boolean;
    tags: string[]
}

export interface PromotionResult {
    id: string
    created_at: string
    user_id: string
    discount_type: string
    discount_value: string
    description: string
    valid_till: string
    image_url: string
    discount_title: string
    liked_by?: number
    user?: RestaurantUser
}


export const foodTags = [
    "Foodie",
    "Gourmet",
    "Savory Bites",
    "Authentic Flavors",
    "Fine Dining",
    "Street Food",
    "Comfort Food",
    "Vegan Food",
    "Local Eats",
    "Sweet Tooth"
];
