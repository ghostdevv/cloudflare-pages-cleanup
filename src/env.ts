import { load } from 'https://deno.land/std@0.222.1/dotenv/mod.ts';

export const {
	CLOUDFLARE_PAGES_PROJECT,
	CLOUDFLARE_ACCOUNT_ID,
	CLOUDFLARE_TOKEN,
} = await load({ export: true });
