import { Asset } from "./.github/cicd/asset-model.ts";
import { ReleaseClient } from "./.github/cicd/release-client.ts";
import { ReleaseModel } from "./.github/cicd/release-model.ts";

const ownerName = "KinsonDigital";
const repoName = "tauri-playground";
const token = Deno.env.get("CICD_TOKEN") ?? "";

const client = new ReleaseClient(ownerName, repoName, token);

const releaseId = await client.getReleaseId("v0.4.0");

const baseUrl = "https://uploads.github.com";
const queryParams = `?name=latestNEW.json`;
const fullUrl = `${baseUrl}/repos/${ownerName}/${repoName}/releases/${releaseId}/assets${queryParams}`;

const body = Deno.readTextFileSync("./test-data.json");

const response = await fetch(fullUrl, {
	method: "POST",
	headers: {
		"Accept": "application/vnd.github+json",
		"X-GitHub-Api-Version": "2022-11-28",
		"Content-Type": "application/octet-stream",
		"Authorization": `Bearer ${token}`,
	},
	body: body,
});

if (response.status !== 201) {
	const errorMsg = `Status Code: ${response.status} ${response.statusText}`;
	console.log(errorMsg);
	Deno.exit(1);
}

console.log("Release Asset Uploaded");

debugger;
