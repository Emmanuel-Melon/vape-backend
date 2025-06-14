import * as dotenv from 'dotenv';

dotenv.config();

export const supabaseUrl = process.env.SUPABASE_URL;
export const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
export const databaseUrl = process.env.DATABASE_URL;
export const port = process.env.PORT || 8000;
export const supabaseJwtSecret = process.env.SUPABASE_JWT_SECRET;
export const nextPublicSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const nextPublicSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const serviceRoleKey = process.env.SERVICE_ROLE_KEY;
export const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
export const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
export const googlePlacesRegion = process.env.GOOGLE_PLACES_REGION;