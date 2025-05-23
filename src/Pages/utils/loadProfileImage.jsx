import { API_BASE_URL } from "../../config";

export async function loadProfileImage() {
    const res = await fetch(`${API_BASE_URL}/load-image`, {
        method: "GET",
        credentials: "include",
    });

    if (!res.ok) return { success: false };

    const data = await res.json();
    return {
        success: true,
        imageUrl: data.imageUrl,
    };
}
