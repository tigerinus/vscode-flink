import path = require("path");
import { CancellationToken, Event, ExtensionContext, ProviderResult, TextDocumentContentProvider, Uri } from "vscode";
import { JobManager } from "./types/jobManager";

export class ContentProvider implements TextDocumentContentProvider {

    private _context: ExtensionContext;

    readonly onDidChange: Event<Uri> | undefined;

    constructor(context: ExtensionContext) {
        this._context = context;
    }

    provideTextDocumentContent(uri: Uri, token: CancellationToken): ProviderResult<string> {

        let pathTokens = uri.path.split('/');
        let jobManagerId = pathTokens[1];
        let apiPath = pathTokens.splice(2, pathTokens.length - 3).join('/');

        if ('jobmanagers' === uri.authority) {
            let jobManagerList = this._context.globalState.get('jobManagerList', [])
                .map((object: Object) => {
                    // workaround for deserialization into prototype, or methods will be missing.
                    return Object.assign(new JobManager('', ''), object);
                });
            let jobManager = jobManagerList.find(m => m.id === jobManagerId);

            if (undefined === jobManager) {
                return `JobManager ${jobManagerId} not found.`;
            }

            if (token.isCancellationRequested) {
                return 'cancelled.';
            }

            return fetch(`${jobManager.address}/${apiPath}`)
                .then(response => response.json())
                .catch(error => error.message)
                .then(json => JSON.stringify(json, null, 2));
        }

        throw new Error(`Uri ${uri} not supported.`);
    }
}