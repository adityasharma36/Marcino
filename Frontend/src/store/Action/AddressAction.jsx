import Axios from "../../Utils/axios";
import { setAddress } from "../Slice/AddressSlice";

export const userLocation = (credentials) => async (dispatch) => {
    try {
        // Map incoming Nominatim address object to backend-required shape
        const streetParts = [];
      
       

        const zipcode = (credentials.postcode ?? credentials.zipcode ?? "").toString();

        const requestBody = {
            
            street:credentials.county,
            zipcode,
            city: credentials.city || credentials.town || credentials.village || credentials.county || "",
            state: credentials.state || "",
            country: credentials.country || "",
            lat: credentials.lat ?? credentials.latitude ?? null,
            lon: credentials.lon ?? credentials.longitude ?? null,
        };

        // console.debug("userLocation: sending mapped payload ->", requestBody);
        const response = await Axios.post("/auth/users/me/addresses", requestBody);

        const payload = response?.data?.addresses ?? response?.data ?? [];

        dispatch(setAddress(payload));

        // console.log("set successfully")
        return response.data;
    } catch (error) {

        console.error("userLocation error:", {

            message: error.message,
            status: error.response?.status,
            data: error.response?.data,

        });
        throw error;
    }
};