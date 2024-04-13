import { colors } from 'https://deno.land/x/cliffy@v1.0.0-rc.4/ansi/colors.ts';
import type { DeploymentsResponse, Deployment } from './types.d.ts';
import { differenceInDays } from 'npm:date-fns';
import { FetchError, ofetch } from 'npm:ofetch';
import * as env from './env.ts';

const FORCE_DELETE = false;

const pages = ofetch.create({
	baseURL: `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/pages/projects/${env.CLOUDFLARE_PAGES_PROJECT}`,
	headers: {
		Authorization: `Bearer ${env.CLOUDFLARE_TOKEN}`,
	},
});

async function fetch_all_deployments(page = 1): Promise<Deployment[]> {
	const deployments = await pages<DeploymentsResponse>('/deployments', {
		query: { page },
	});

	if (page < deployments.result_info.total_pages) {
		return [
			...deployments.result,
			...(await fetch_all_deployments(deployments.result_info.page + 1)),
		];
	}

	return deployments.result;
}

const deployments = await fetch_all_deployments();
const NOW = new Date();

console.log(`Found ${deployments.length} deployments\n`);

let processed = 0;
let deleted = 0;

for (const deployment of deployments) {
	const days = differenceInDays(NOW, deployment.created_on);
	const shouldDelete = days > 14;

	processed++;

	if (shouldDelete && deployment.aliases?.length && !FORCE_DELETE) {
		console.log(
			colors.yellow('Ignoring'),
			`${deployment.id} (${deployment.short_id})`,
			`has ${deployment.aliases.length} aliase(s)`,
		);
	} else {
		console.log(
			shouldDelete ? colors.red('Deleting') : colors.green('Skipping'),
			`${deployment.id} (${deployment.short_id})`,
			`at ${days} days old (${processed}/${deployments.length})`,
			FORCE_DELETE && shouldDelete ? colors.bold.red('FORCED') : '',
		);

		if (shouldDelete) {
			await pages(`/deployments/${deployment.id}`, {
				method: 'DELETE',
				params: { force: FORCE_DELETE },
			})
				.catch((e: FetchError) => {
					console.log(
						colors.bold.red('  FAILED'),
						`(${e.status})`,
						colors.dim(`${e.data?.errors?.[0]?.message}`),
					);
				})
				.then(() => deleted++);
		}
	}
}

console.log(
	`\nDone! Processed ${processed} and deleted ${deleted}`,
	`(${((deleted / processed) * 100).toFixed(2)}%)`,
);
