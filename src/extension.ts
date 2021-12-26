import * as _ from 'lodash';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { commands, env, ExtensionContext, window } from 'vscode';
import { JobManagerDataProvider } from './treeDataProvider';
import { Job } from './types/job';
import { JobGroup } from './types/jobGroup';
import { JobManager } from './types/jobManager';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('activating vscode-flink...');

    const jobManagerDataProvider = new JobManagerDataProvider(context);

    context.subscriptions.push(
        window.registerTreeDataProvider('flink', jobManagerDataProvider)
    );

    context.subscriptions.push(
        commands.registerCommand('flink.add-jobmanager', () => {
            let jobManagerList: JobManager[] | undefined = context.globalState.get('jobManagerList', [] as JobManager[]);

            window.showInputBox({
                prompt: 'Please enter the JobManager address',
                placeHolder: 'localhost:8081',
                title: 'Add JobManager',
                ignoreFocusOut: true,
                validateInput: (address: string) => {
                    if (address.indexOf(':') === -1) {
                        return 'Please enter the JobManager address in the format of host:port';
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
        commands.registerCommand('flink.remove-jobmanager', (selectedJobManager: JobManager) => {
            let jobManagerList: JobManager[] | undefined = context.globalState.get('jobManagerList');

            if (undefined === jobManagerList) {
                return;
            }

            jobManagerList = jobManagerList.filter((jobManager: JobManager) => jobManager.address !== selectedJobManager.address);
            context.globalState.update('jobManagerList', jobManagerList)
                .then(() => {
                    jobManagerDataProvider.refresh();
                })
                .then(() => {
                    window.showInformationMessage(`Removed Job Manager '${selectedJobManager.displayName}' at ${selectedJobManager.address} successfully.`);
                });
        })
    );

    context.subscriptions.push(
        commands.registerCommand('flink.refresh-jobs', (selectedJobGroup: JobGroup) => {
            jobManagerDataProvider.refresh(selectedJobGroup);
        })
    );

    context.subscriptions.push(
        commands.registerCommand('flink.copy-job-id', (selectedJob: Job) => {
            env.clipboard.writeText(selectedJob.jobId)
                .then(() => {
                    window.showInformationMessage(`Copied job ID: ${selectedJob.jobId} to clipboard`);
                });
        }
        ));
}

// this method is called when your extension is deactivated
export function deactivate() {
    console.log('deactivating vscode-flink...');
}
