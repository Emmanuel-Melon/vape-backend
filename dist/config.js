"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.googlePlacesRegion = exports.googleMapsApiKey = exports.supabaseAnonKey = exports.serviceRoleKey = exports.nextPublicSupabaseAnonKey = exports.nextPublicSupabaseUrl = exports.supabaseJwtSecret = exports.port = exports.databaseUrl = exports.supabaseServiceKey = exports.supabaseUrl = void 0;
const dotenv = require("dotenv");
dotenv.config();
exports.supabaseUrl = process.env.SUPABASE_URL;
exports.supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
exports.databaseUrl = process.env.DATABASE_URL;
exports.port = process.env.PORT || 8000;
exports.supabaseJwtSecret = process.env.SUPABASE_JWT_SECRET;
exports.nextPublicSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
exports.nextPublicSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
exports.serviceRoleKey = process.env.SERVICE_ROLE_KEY;
exports.supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
exports.googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
exports.googlePlacesRegion = process.env.GOOGLE_PLACES_REGION;
//# sourceMappingURL=config.js.map