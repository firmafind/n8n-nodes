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
			"Österreichische Firmenbuchdaten, Änderungen, Urkunden und Bilanzen abrufen",
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
							"Firmen nach Name oder Suchbegriff suchen (mindestens 3 Zeichen)",
						action: "Firma suchen",
						routing: {
							request: {
								method: "GET",
								url: "/search",
								qs: {
									name: "={{$parameter.searchQuery}}",
									exact: "={{$parameter.exactMatch}}",
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
								url: "=/company/{{$parameter.fnr}}",
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
								qs: {
									from: "={{$parameter.from}}",
									to: "={{$parameter.to}}",
								},
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
								qs: {
									years: "={{$parameter.years}}",
									include: "={{$parameter.include.join(',')}}",
								},
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
				placeholder: "z. B. Muster GmbH",
				description:
					"Name des Unternehmens (mindestens 3 Zeichen); für eine Firmenbuchnummer die Operation Get Details verwenden",
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
			{
				displayName: "Von (YYYY-MM-DD)",
				name: "from",
				type: "string",
				required: true,
				default: "",
				placeholder: "2026-10-20",
				description:
					"Datum im Format YYYY-MM-DD. Der gesamte Zeitraum darf maximal 7 Tage umfassen.",
				displayOptions: {
					show: {
						resource: ["company"],
						operation: ["getChanges"],
					},
				},
			},
			{
				displayName: "Bis (YYYY-MM-DD)",
				name: "to",
				type: "string",
				required: true,
				default: "",
				placeholder: "2026-10-20",
				description:
					"Datum im Format YYYY-MM-DD. Der gesamte Zeitraum darf maximal 7 Tage umfassen.",
				displayOptions: {
					show: {
						resource: ["company"],
						operation: ["getChanges"],
					},
				},
			},
			{
				displayName: "Berichtsperioden",
				name: "years",
				type: "number",
				default: 5,
				typeOptions: {
					minValue: 1,
					maxValue: 5,
					numberPrecision: 0,
				},
				description:
					"Anzahl der letzten Berichtsperioden (1–5). 1 Periode: 15 Credits; 2–5 Perioden: 25 Credits.",
				displayOptions: {
					show: {
						resource: ["financials"],
						operation: ["getFinancials"],
					},
				},
			},
			{
				displayName: "Finanzdaten einschließen",
				name: "include",
				type: "multiOptions",
				default: ["summary", "periods", "changes", "evidence"],
				options: [
					{
						name: "Zusammenfassung",
						value: "summary",
					},
					{
						name: "Berichtsperioden",
						value: "periods",
					},
					{
						name: "Veränderungen",
						value: "changes",
					},
					{
						name: "Quellennachweise",
						value: "evidence",
					},
					{
						name: "Dokumente",
						value: "documents",
					},
				],
				description:
					"Gewünschte Erweiterungen der Finanzdaten. Die Zusammenfassung wird immer geliefert.",
				displayOptions: {
					show: {
						resource: ["financials"],
						operation: ["getFinancials"],
					},
				},
			},
		],
	};
}
