export interface DeploymentsResponse {
	result: Deployment[];
	success: boolean;
	errors: unknown[];
	messages: unknown[];
	result_info: ResultInfo;
}

export interface Deployment {
	id: string;
	short_id: string;
	project_id: string;
	project_name: string;
	environment: string;
	url: string;
	created_on: string;
	modified_on: string;
	latest_stage: LatestStage;
	deployment_trigger: DeploymentTrigger;
	stages: Stage[];
	build_config: BuildConfig;
	source: Source;
	env_vars: Record<string | symbol | number, unknown>;
	kv_namespaces: KvNamespaces;
	compatibility_date: string;
	compatibility_flags: unknown[];
	build_image_major_version: number;
	usage_model: string;
	aliases?: string[];
	is_skipped: boolean;
	production_branch: string;
}

export interface LatestStage {
	name: string;
	started_on: string;
	ended_on: string;
	status: string;
}

export interface DeploymentTrigger {
	type: string;
	metadata: Metadata;
}

export interface Metadata {
	branch: string;
	commit_hash: string;
	commit_message: string;
	commit_dirty: boolean;
}

export interface Stage {
	name: string;
	started_on: string;
	ended_on: string;
	status: string;
}

export interface BuildConfig {
	build_command: string;
	destination_dir: string;
	build_caching: unknown;
	root_dir: string;
	web_analytics_tag: unknown;
	web_analytics_token: unknown;
}

export interface Source {
	type: string;
	config: Config;
}

export interface Config {
	owner: string;
	repo_name: string;
	production_branch: string;
	pr_comments_enabled: boolean;
}

export interface KvNamespaces {
	LINKS: Links;
	LINKS_MAP: LinksMap;
}

export interface Links {
	namespace_id: string;
}

export interface LinksMap {
	namespace_id: string;
}

export interface ResultInfo {
	page: number;
	per_page: number;
	count: number;
	total_count: number;
	total_pages: number;
}
