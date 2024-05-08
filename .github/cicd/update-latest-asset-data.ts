import { Asset } from "./asset-model.ts";
import { ReleaseClient } from "./release-client.ts";

const ownerName = Deno.env.get("OWNER_NAME") ?? "";
const repoName = Deno.env.get("REPO_NAME") ?? "";
const token = Deno.env.get("CICD_TOKEN") ?? "";
const tag = Deno.env.get("TAG") ?? "";
const authGuid = Deno.env.get("AUTH_GUID") ?? "";

// TODO: Check if the env vars are incorrect and throw errors

const client = new ReleaseClient(ownerName, repoName, token);
const assetData = await client.getLatestAssetData(tag);

if (assetData instanceof Error || assetData === null) {
	if (assetData instanceof Error) {
		console.error(assetData.message);
	}

	Deno.exit(1);
}

const winAssetName = assetData.platforms["windows-x86_64"].url.split("/").pop() ?? "";
const linuxAssetName = assetData.platforms["linux-x86_64"].url.split("/").pop() ?? "";
const appleAssetName = assetData.platforms["darwin-x86_64"].url.split("/").pop() ?? "";
const appleSiliconAssetName = assetData.platforms["darwin-aarch64"].url.split("/").pop() ?? "";

const assetIdRequests: Promise<Error | Asset | null>[] = [];

assetIdRequests.push(client.getAssetByReleaseTag(tag, winAssetName));
assetIdRequests.push(client.getAssetByReleaseTag(tag, linuxAssetName));
assetIdRequests.push(client.getAssetByReleaseTag(tag, appleAssetName));
assetIdRequests.push(client.getAssetByReleaseTag(tag, appleSiliconAssetName));

const assetIds = await Promise.all(assetIdRequests);

// Check if there are any errors

const errors = assetIds.filter((asset) => asset instanceof Error) as Error[];

if (errors.length > 0) {
	const errorMsgs = errors.map((error) => error.message).join("\n");
	console.log(`::error:: ${errorMsgs}`);
	Deno.exit(1);
}

const [winAsset, linuxAsset, appleAsset, appleSiliconAsset ] = assetIds as Asset[];

const updateProxyBaseUrl = "https://update-proxy.deno.dev";

assetData.platforms["windows-x86_64"].url = `${updateProxyBaseUrl}?assetId=${winAsset.id}&authId=${authGuid}`;
assetData.platforms["linux-x86_64"].url = `${updateProxyBaseUrl}?assetId=${linuxAsset.id}&authId=${authGuid}`;
assetData.platforms["darwin-x86_64"].url = `${updateProxyBaseUrl}?assetId=${appleAsset.id}&authId=${authGuid}`;
assetData.platforms["darwin-aarch64"].url = `${updateProxyBaseUrl}?assetId=${appleSiliconAsset.id}&authId=${authGuid}`;

await client.uploadLatestDataAsset(tag, JSON.stringify(assetData, null, 2));

