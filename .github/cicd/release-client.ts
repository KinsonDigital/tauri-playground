import { Asset } from "./asset-model.ts";
import { LatestAssetModel } from "./latest-asset-model.ts";
import { ReleaseModel } from "./release-model.ts";

export class ReleaseClient {
	private readonly ownerName: string;
	private readonly repoName: string;
	private readonly token: string;

	/**
	 * Performs GitHub release related API requests.
	 * @param ownerName The name of the owner of the repository.
	 * @param repoName The name of the repository.
	 * @param token The authentication token.
	 */
	constructor(ownerName: string, repoName: string, token: string) {
		this.ownerName = ownerName;
		this.repoName = repoName;
		this.token = token;
	}

	public async getAsset(releaseId: number, assetName: string): Promise<Asset | null | Error> {
		const url = `https://api.github.com/repos/${this.ownerName}/${this.repoName}/releases/${releaseId}/assets`;

		const response = await fetch(url, {
			headers: {
				"Accept": "application/vnd.github+json",
				"X-GitHub-Api-Version": "2022-11-28",
				"Authorization": `Bearer ${this.token}`,
			}
		});

		if (response.status !== 200) {
			const errorMsg = `Status Code: ${response.status} ${response.statusText}`;
			return new Error(errorMsg);
		}

		const data = await response.json() as Asset[];

		const asset = data.find(asset => asset.name === assetName);

		return asset === undefined ? null : asset;
	}

	public async getReleaseId(tagName: string): Promise<number | null | Error> {
		const url = `https://api.github.com/repos/${this.ownerName}/${this.repoName}/releases`;

		const response = await fetch(url, {
			headers: {
				"Accept": "application/vnd.github+json",
				"X-GitHub-Api-Version": "2022-11-28",
				"Authorization": `Bearer ${this.token}`,
			}
		});

		if (response.status !== 200) {
			const errorMsg = `Status Code: ${response.status} ${response.statusText}`;
			return new Error(errorMsg);
		}

		const assetsJsonData = await response.json() as ReleaseModel[];

		const foundRelease = assetsJsonData.find((release) => release.tag_name === tagName);

		return foundRelease === undefined ? null : foundRelease.id;
	}

	public async getAssetByReleaseTag(tag: string, assetName: string): Promise<Asset | null | Error> {
		const releaseId = await this.getReleaseId(tag);

		if (releaseId instanceof Error || releaseId === null) {
			return releaseId;
		}

		const asset = await this.getAsset(releaseId, assetName);

		return asset;
	}

	public async getLatestAssetData(tag: string): Promise<LatestAssetModel | Error | null> {
		const asset = await this.getAssetByReleaseTag(tag, "latest.json");

		if (asset instanceof Error || asset === null) {
			return asset;
		}

		const url = `https://api.github.com/repos/${this.ownerName}/${this.repoName}/releases/assets/${asset.id}`;

		const response = await fetch(url, {
			headers: {
				"Accept": "application/octet-stream",
				"X-GitHub-Api-Version": "2022-11-28",
				"Authorization": `Bearer ${this.token}`,
			}
		});

		if (response.status !== 200) {
			const errorMsg = `Status Code: ${response.status} ${response.statusText}`;
			return new Error(errorMsg);
		}

		const textContent = await response.json() as LatestAssetModel;

		return textContent;
	}

	public async deleteAsset(releaseId: number, assetId: number): Promise<void | Error> {
		const baseUrl = "https://api.github.com";
		const fullUrl = `${baseUrl}/repos/${this.ownerName}/${this.repoName}/releases/assets/${assetId}`;
		
		const response = await fetch(fullUrl, {
			method: "DELETE",
			headers: {
				"Accept": "application/vnd.github+json",
				"X-GitHub-Api-Version": "2022-11-28",
				"Authorization": `Bearer ${this.token}`,
			},
		});
		
		if (response.status !== 204) {
			const errorMsg = `Status Code: ${response.status} ${response.statusText}`;
			return new Error(errorMsg);
		}
	}

	public async uploadLatestDataAsset(tag: string, latestData: string): Promise<void | Error> {
		const latestDataFileName = "latest.json";
		const releaseId = await this.getReleaseId(tag);

		if (releaseId instanceof Error) {
			return releaseId;
		}
		
		if (releaseId === null) {
			return new Error(`The release with tag ${tag} was not found.`);
		}

		const asset = await this.getAsset(releaseId, latestDataFileName);

		if (asset instanceof Error) {
			return asset;
		}

		// if the asset does not equal null
		if (asset !== null) {
			await this.deleteAsset(releaseId, asset.id);
		}

		const baseUrl = "https://uploads.github.com";
		const queryParams = `?name=${latestDataFileName}`;
		const fullUrl = `${baseUrl}/repos/${this.ownerName}/${this.repoName}/releases/${releaseId}/assets${queryParams}`;

		const response = await fetch(fullUrl, {
			method: "POST",
			headers: {
				"Accept": "application/vnd.github+json",
				"X-GitHub-Api-Version": "2022-11-28",
				"Content-Type": "application/octet-stream",
				"Authorization": `Bearer ${this.token}`,
			},
			body: latestData,
		});

		if (response.status !== 201) {
			const errorMsg = `Status Code: ${response.status} ${response.statusText}`;
			return new Error(errorMsg);
		}
	}
}
