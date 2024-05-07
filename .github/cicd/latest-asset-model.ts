export interface LatestAssetModel {
	version: string;
	notes: string;
	pub_date: string;
	platforms: {
		"darwin-aarch64": {
			signature: string;
			url: string;
		},
		"darwin-x86_64": {
			signature: string;
			url: string;
		},
		"linux-x86_64": {
			signature: string;
			url: string;
		},
		"windows-x86_64": {
			signature: string;
			url: string;
		}
	}
}
