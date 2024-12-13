"use client";

import { Button } from "@/components/ui/button";
import {createClient} from "@/lib/supabase/client";

export const LogoutButton = () => {
    const supabase = createClient(); // Client instance of Supabase

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Error logging out:", error.message);
        } else {
            // Redirect after successful logout
            window.location.href = "/auth/login";
        }
    };
    
    return (
        <Button variant="outline" onClick={handleLogout}>
            Logout
        </Button>
    );
};