import type { INodeType, INodeTypeDescription } from "n8n-workflow";

export class Firmafind implements INodeType {
	description: INodeTypeDescription = {
		displayName: "firmafind",
		name: "firmafind",
		icon: "file:firmafind.svg",
		group: ["transform"],
		version: 1,
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
		description:
			"Österreichische Firmenbuchdaten, UID-Validierung und Bilanzen abrufen",
		defaults: {
			name: "firmafind",
		},
		inputs: ["main"],
		outputs: ["main"],
		credentials: [
			{
				name: "firmafindApi",
				required: true,
			},
		],
		requestDefaults: {
			baseURL: "https://firmafind.at/api",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		},
		properties: [
			// Resource Selection
			{
				displayName: "Resource",
				name: "resource",
				type: "options",
				noDataExpression: true,
				options: [
					{
						name: "Company (Firma)",
						value: "company",
						description:
							"Firmensuche, Stammdaten, Vertretungsbefugte und Änderungen",
					},
					{
						name: "Financials (Jahresabschluss)",
						value: "financials",
						description:
							"Normalisierte Bilanzdaten und Kennzahlen aus Firmenbuch-Bilanzen",
					},
					{
						name: "Documents (Urkunden & Bilanzen)",
						value: "documents",
						description:
							"Eingereichte Firmenbuch-Dokumente und Original-Jahresabschlüsse",
					},
				],
				default: "company",
			},

			// ─────────────────────────────────────────
			// Operations: Company
			// ─────────────────────────────────────────
			{
				displayName: "Operation",
				name: "operation",
				type: "options",
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ["company"],
					},
				},
				options: [
					{
						name: "Search (Firmensuche)",
						value: "search",
						description:
							"Nach Firmen nach Name, Suchbegriff oder Firmenbuchnummer suchen",
						action: "Firma suchen",
						routing: {
							request: {
								method: "GET",
								url: "/companies",
								qs: {
									q: "={{$parameter.searchQuery}}",
									exactMatch: "={{$parameter.exactMatch}}",
								},
							},
						},
					},
					{
						name: "Get Details (Stammdaten)",
						value: "getDetails",
						description:
							"Vollständige Stammdaten, Vertretungsbefugte, Adresse und UID per FN abrufen",
						action: "Firmendetails abrufen",
						routing: {
							request: {
								method: "GET",
								url: "=/companies/{{$parameter.fnr}}",
							},
						},
					},
					{
						name: "Get Changes (Änderungsüberwachung)",
						value: "getChanges",
						description:
							"Tagesaktuelle Änderungen und Neueintragungen im Firmenbuch abfragen",
						action: "Firmenbuchänderungen abfragen",
						routing: {
							request: {
								method: "GET",
								url: "/company/changes",
							},
						},
					},
				],
				default: "search",
			},

			// ─────────────────────────────────────────
			// Operations: Financials
			// ─────────────────────────────────────────
			{
				displayName: "Operation",
				name: "operation",
				type: "options",
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ["financials"],
					},
				},
				options: [
					{
						name: "Get Balance Sheet (Jahresabschluss)",
						value: "getFinancials",
						description:
							"Normalisierte Bilanz- und GuV-Kennzahlen einer österreichischen Firma abrufen",
						action: "Jahresabschluss abrufen",
						routing: {
							request: {
								method: "GET",
								url: "=/financials/{{$parameter.fnr}}",
							},
						},
					},
				],
				default: "getFinancials",
			},

			// ─────────────────────────────────────────
			// Operations: Documents
			// ─────────────────────────────────────────
			{
				displayName: "Operation",
				name: "operation",
				type: "options",
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ["documents"],
					},
				},
				options: [
					{
						name: "Search Filings (Urkunden auflisten)",
						value: "searchDocuments",
						description:
							"Verfügbare Urkunden, Gesellschafterbeschlüsse und eingereichte Bilanzen auflisten",
						action: "Urkunden auflisten",
						routing: {
							request: {
								method: "GET",
								url: "/documents",
								qs: {
									fnr: "={{$parameter.fnr}}",
								},
							},
						},
					},
				],
				default: "searchDocuments",
			},

			// ─────────────────────────────────────────
			// Parameters: Company Search
			// ─────────────────────────────────────────
			{
				displayName: "Suchbegriff / Name",
				name: "searchQuery",
				type: "string",
				required: true,
				displayOptions: {
					show: {
						resource: ["company"],
						operation: ["search"],
					},
				},
				default: "",
				placeholder: "z. B. Red Bull oder 338647a",
				description: "Name des Unternehmens oder Firmenbuchnummer",
			},
			{
				displayName: "Exakte Übereinstimmung",
				name: "exactMatch",
				type: "boolean",
				displayOptions: {
					show: {
						resource: ["company"],
						operation: ["search"],
					},
				},
				default: false,
				description: "Whether to require an exact match for the company name",
			},

			// ─────────────────────────────────────────
			// Parameters: FNR for Details / Financials / Documents
			// ─────────────────────────────────────────
			{
				displayName: "Firmenbuchnummer (FN)",
				name: "fnr",
				type: "string",
				required: true,
				displayOptions: {
					show: {
						operation: ["getDetails", "getFinancials", "searchDocuments"],
					},
				},
				default: "",
				placeholder: "z. B. 123456a",
				description:
					"Die Firmenbuchnummer der österreichischen Gesellschaft (mit Prüfbuchstaben)",
			},
		],
	};
}
