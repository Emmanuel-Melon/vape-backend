"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const config_1 = require("../config");
if (!config_1.supabaseAnonKey || !config_1.supabaseUrl) {
    throw new Error('Missing Supabase service key or URL');
}
exports.supabase = (0, supabase_js_1.createClient)(config_1.supabaseUrl, config_1.supabaseAnonKey);
//# sourceMappingURL=supabase.js.map