import * as vscode from 'vscode';
import * as path from 'path';
import { extensionConfig } from './extensionConfig';

export const workspaceUtils = {
  get activeWorkspace() {
    const workspaces = vscode.workspace.workspaceFolders;
    if (workspaces && workspaces.length) {
      return workspaces[0];
    }
    return null;
  },

  getActiveDoc({ returnRelativePath = true } = {}) {
    const { activeTextEditor } = vscode.window;
    if (!this.activeWorkspace || !activeTextEditor) return null;

    const activeDocUrl = activeTextEditor.document.uri.fsPath;
    const workspaceUrl = this.activeWorkspace.uri.fsPath;
    const isParentPath = createPathChecker(workspaceUrl).of(activeDocUrl);

    if (!isParentPath) return null;

    return returnRelativePath ? activeDocUrl.replace(this.cwd!, '') : activeDocUrl;
  },

  get cwd() {
    const workspace = this.activeWorkspace;
    if (workspace) {
      return path.join(workspace.uri.fsPath, extensionConfig.root.get());
    }
    return null;
  }
};

function createPathChecker(parentPath: string) {
  return {
    of: (childPath: string) => {
      return childPath.startsWith(parentPath);
    }
  };
}
