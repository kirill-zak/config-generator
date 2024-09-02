import { v4 as uuidv4 } from 'uuid';

import { action, autorun, observable, set, toJS } from 'mobx';

import { IRootStore } from '.';

export interface IWorkspaceId {
  workspaceId: string
  rootStore: IRootStore;

  loadAndSave(): any;

  loadImportedFile(workspaceId: any): any;
}

function autoSave(store: any, save: any) {
  let firstRun = true;
  autorun(() => {
    const workspaceStore = toJS(store);
    delete workspaceStore.rootStore;
    if (!firstRun) {
      save(workspaceStore.workspaceId);
    }
    firstRun = false;
  });
}

export class WorkspaceId implements IWorkspaceId {
  @observable workspaceId = ""
  rootStore: IRootStore;

  constructor(rootStore: IRootStore) {
    this.rootStore = rootStore;
    this.loadAndSave();
  }

  public loadAndSave() {
    this.load();
    autoSave(this, this.save.bind(this));
  }

  public load() {
    let workspaceId = localStorage.getItem('workspaceId');

    if (!workspaceId) {
      workspaceId = uuidv4();
      localStorage.setItem('workspaceId', workspaceId)  
    }

    this.workspaceId = workspaceId;
    set(this, new String(workspaceId));
  }

  public loadImportedFile(workspaceId: any) {
    if (workspaceId) {
      this.workspaceId = workspaceId;
    } else {
      this.workspaceId = uuidv4();
    }
  }

  public save(json: string) {
    localStorage.setItem('workspaceId', json);
  }
}
