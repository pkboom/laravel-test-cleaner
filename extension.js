const vscode = require('vscode');
const CleanTest = require('./CleanTest');

function activate(context) {
    let cleaner = new CleanTest();

    context.subscriptions.push(vscode.commands.registerCommand('clean.test', () => {
            cleaner.clean();
        })
    );
}

exports.activate = activate;