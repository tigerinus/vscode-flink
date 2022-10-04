import axios from 'axios';
import FormData = require('form-data');
import * as fs from 'fs';
import * as _ from 'lodash';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { commands, env, ExtensionContext, Uri, window, workspace } from 'vscode';
import { ContentProvider } from './textDocumentContentProvider';
import { JobManagerDataProvider } from './treeDataProvider';
import { Jar } from './types/jar';
import { JarGroup } from './types/jarGroup';
import { Job } from './types/job';
import { JobGroup } from './types/jobGroup';
import { JobManager } from './types/jobManager';



// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('activating vscode-flink...');

    // treeDataProvider
    const jobManagerDataProvider = new JobManagerDataProvider(context);
    context.subscriptions.push(
        window.registerTreeDataProvider('flink', jobManagerDataProvider)
    );

    // contentProvider
    const contentProvider = new ContentProvider(context);
    workspace.registerTextDocumentContentProvider('vscode-flink', contentProvider);

    // commands
    context.subscriptions.push(
        commands.registerCommand('flink.add-jobmanager', () => {
            let jobManagerList: JobManager[] | undefined = context.globalState.get('jobManagerList', [] as JobManager[]);

            window.showInputBox({
                prompt: 'Please enter the JobManager address',
                placeHolder: 'http://localhost:8081',
                title: 'Add JobManager',
                ignoreFocusOut: true,
                validateInput: (address: string) => {

                    try {
                        Uri.parse(address, true);
                    } catch (e) {
                        return "address is not valid.";
                    }

                    if (_.find(jobManagerList, { address })) {
                        return 'The JobManager address already exists.';
                    }

                    return null;
                }
            }).then(async address => {
                if (!address) {
                    return;
                }

                return window.showInputBox({
                    prompt: 'Please enter the JobManager display name',
                    title: 'Add JobManager',
                    ignoreFocusOut: true,
                }).then(displayName => {
                    if (!displayName) {
                        return;
                    }
                    return new JobManager(address, displayName);
                });
            }).then(jobManager => {
                if (undefined === jobManager) {
                    return;
                }

                if (undefined === jobManagerList) {
                    jobManagerList = [jobManager];
                } else {
                    jobManagerList.push(jobManager);
                    jobManagerList = _.uniq(jobManagerList);
                }
                context.globalState.update('jobManagerList', jobManagerList)
                    .then(() => {
                        window.showInformationMessage(`Added Job Manager '${jobManager.displayName}' at ${jobManager.address} successfully.`);
                    });
            }).then(() => {
                jobManagerDataProvider.refresh();
            });
        })
    );

    context.subscriptions.push(
        commands.registerCommand('flink.remove-jobmanager', (jobManager: JobManager) => {
            let jobManagerList: JobManager[] | undefined = context.globalState.get('jobManagerList');

            if (undefined === jobManagerList) {
                return;
            }

            jobManagerList = jobManagerList.filter((m: JobManager) => m.id !== jobManager.id);
            context.globalState.update('jobManagerList', jobManagerList)
                .then(() => {
                    jobManagerDataProvider.refresh();
                })
                .then(() => {
                    window.showInformationMessage(`Removed Job Manager '${jobManager.displayName}' at ${jobManager.address} successfully.`);
                });
        })
    );

    context.subscriptions.push(
        commands.registerCommand('flink.describe-jobmanager', async (jobManager: JobManager) => {
            let uri = Uri.parse(`vscode-flink://jobmanagers/${jobManager.id}/jobmanager/config/${jobManager.id}-config-${Date.now()}.json`);
            await window.showTextDocument(uri);
        })
    );

    context.subscriptions.push(
        commands.registerCommand('flink.refresh-jobs', (jobGroup: JobGroup) => {
            jobManagerDataProvider.refresh(jobGroup);
        })
    );

    context.subscriptions.push(
        commands.registerCommand('flink.add-job', () => {
            window.showInformationMessage('Not implemented yet.');
        })
    );

    context.subscriptions.push(
        commands.registerCommand('flink.describe-jobs', async (jobGroup: JobGroup) => {
            let uri = Uri.parse(`vscode-flink://jobmanagers/${jobGroup.jobManager.id}/jobs/overview/${jobGroup.jobManager.id}-jobs-overview-${Date.now()}.json`);
            await window.showTextDocument(uri);
        })
    );

    context.subscriptions.push(
        commands.registerCommand('flink.describe-job', async (job: Job) => {
            let uri = Uri.parse(`vscode-flink://jobmanagers/${job.jobManager.id}/jobs/${job.jobId}/${job.jobId}-${Date.now()}.json`);
            await window.showTextDocument(uri);
        })
    );

    context.subscriptions.push(
        commands.registerCommand('flink.copy-job-id', (job: Job) => {
            env.clipboard.writeText(job.jobId)
                .then(() => {
                    window.showInformationMessage(`Copied job ID: ${job.jobId} to clipboard`);
                });
        })
    );

    context.subscriptions.push(
        commands.registerCommand('flink.refresh-jars', (jarGroup: JarGroup) => {
            jobManagerDataProvider.refresh(jarGroup);
        })
    );

    context.subscriptions.push(
        commands.registerCommand('flink.add-jar', () => {
            window.showOpenDialog({
                canSelectFiles: true,
                canSelectFolders: false,
                canSelectMany: false,
                filters: {
                    'jars': ['jar'],
                },
                title: 'Add Jar',
            }).then(async uriList => {
                if (undefined === uriList || uriList.length === 0) {
                    return;
                }

                let formData = new FormData();
                formData.append('jarfile', fs.createReadStream(uriList[0].fsPath), uriList[0].path);

                let url = 'http://localhost:8081/v1/jars/upload'; // TODO - get jobmanager address
                axios.post(url, formData, {
                    headers: formData.getHeaders(),
                    maxBodyLength: Infinity,
                    maxContentLength: Infinity,
                }).then(response => {
                    console.log(response);
                }).catch(error => {
                    console.log(error);
                });
            });

        })
    );

    context.subscriptions.push(
        commands.registerCommand('flink.describe-jars', async (jarGroup: JarGroup) => {
            let uri = Uri.parse(`vscode-flink://jobmanagers/${jarGroup.jobManager.id}/jars/${jarGroup.jobManager.id}-jars-overview-${Date.now()}.json`);
            await window.showTextDocument(uri);
        }
        ));

    context.subscriptions.push(
        commands.registerCommand('flink.describe-jar', async (jar: Jar) => {
            let uri = Uri.parse(`vscode-flink://jobmanagers/${jar.jobManager.id}/jars/${jar.jarId}/${jar.jarId}-${Date.now()}.json`);
            await window.showTextDocument(uri);
        })
    );

    context.subscriptions.push(
        commands.registerCommand('flink.copy-jar-id', (jar: Jar) => {
            env.clipboard.writeText(jar.jarId)
                .then(() => {
                    window.showInformationMessage(`Copied jar ID: ${jar.jarId} to clipboard`);
                });
        })
    );
}

// this method is called when your extension is deactivated
export function deactivate() {
    console.log('deactivating vscode-flink...');
}
