const vscode = require('vscode');

module.exports = class CleanTest {
    async clean() {
        
        if (this.activeEditor() === undefined) {
            return;
        } 
        
        let activeDocument = this.activeDocument().uri;
        
        if (activeDocument === undefined) {
            return;
        }
        
        await this.cleanTest(activeDocument);
    } 
    
    async cleanTest(activeDocument) {
        let doc = await vscode.workspace.openTextDocument(activeDocument);

        let startLine = 0;
        let endLine = 0;
 
        for (let line = 0; line < doc.lineCount; line++) {
            let textLine = doc.lineAt(line).text.trim();

            if (/^class .+/.test(textLine)) {
                startLine = textLine.endsWith('TestCase') ? line + 2 : line + 1;

                break;
            }
        }
        
        for (let line = doc.lineCount - 1; line > 0; line--) {
            let textLine = doc.lineAt(line).text.trim();
            
            if (/}$/.test(textLine)) {
                endLine = line;
                
                break;
            }
        }

        let snippet = '\tuse RefreshDatabase;\$1\n';

        this.activeEditor().insertSnippet(
            new vscode.SnippetString(snippet),
            this.range(startLine, endLine)
        );

        console.log(startLine);
        console.log(endLine);
        
    }
    
    range(startLine, endLine) {
        return new vscode.Range(new vscode.Position(startLine, 0), new vscode.Position(endLine, 0))
    }

    activeEditor() {
        return vscode.window.activeTextEditor;
    }

    activeDocument() {
        return this.activeEditor().document;
    }

    config(key) {
        return vscode.workspace.getConfiguration('phpTestCreator').get(key);
    }
}