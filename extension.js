const vscode = require("vscode");
const prettier = require("prettier");

/**
 *
 * @param {vscode.TextDocument} document
 * @param {vscode.Range} range
 * @param {vscode.FormattingOptions} options
 * @returns
 */
function format(document, range, options) {
  const result = [];
  const content = document.getText(range);
  const editor = vscode.window.activeTextEditor.options;
  const workspace = vscode.workspace.getConfiguration("editor");
  const indentsize = editor.tabSize || workspace.tabSize;

  try {
    const fmtopts = { semi: false, parser: "html" };
    const newText = prettier.format(content, fmtopts);
    result.push(vscode.TextEdit.replace(range, newText));
  } catch (error) {
    vscode.window.showInformationMessage(error.message);
  }

  return result;
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider("nunjucks", {
      provideDocumentFormattingEdits(document, options) {
        const start = new vscode.Position(0, 0);
        const end = new vscode.Position(
          document.lineCount - 1,
          document.lineAt(document.lineCount - 1).text.length
        );
        const range = new vscode.Range(start, end);
        return format(document, range, options);
      },
    })
  );
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
