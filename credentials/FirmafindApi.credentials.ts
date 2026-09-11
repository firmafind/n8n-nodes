import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from "n8n-workflow";

export class FirmafindApi implements ICredentialType {
	name = "firmafindApi";
	displayName = "firmafind API";
	documentationUrl = "https://firmafind.at/docs";
	properties: INodeProperties[] = [
		{
			displayName: "API Key",
			name: "apiKey",
			type: "string",
			typeOptions: { password: true },
			default: "",
			required: true,
			description:
				"Der firmafind API-Key (beginnt mit ff_live_...). Zu finden im Dashboard unter https://firmafind.at/dashboard/keys",
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: "generic",
		properties: {
			headers: {
				"x-api-key": "={{$credentials.apiKey}}",
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: "https://firmafind.at/api",
			url: "/companies?name=Red+Bull&exactMatch=false",
		},
	};
}
