import { ConnectionsStore, IConnectionsStore } from '@stores/connections';
import {
  DestinationsListStore,
  IDestinationsListStore,
} from '@stores/destinationsList';
import {
  ISourceDefinitionsListStore,
  SourceDefinitionsListStore,
} from '@stores/sourceDefinitionsList';

import {
  DestinationDefsListStore,
  IDestinationDefsListStore,
} from './destinationDefsList';
import { ISourcesListStore, SourcesListStore } from './sourcesList';
import { IMessageStore, MessagesStore } from './messages';
import { IWorkspaceId, WorkspaceId } from './workspaceId';

export interface IRootStore {
  sourcesListStore: ISourcesListStore;
  destinationsListStore: IDestinationsListStore;
  sourceDefinitionsListStore: ISourceDefinitionsListStore;
  destinationDefsListStore: IDestinationDefsListStore;
  connectionsStore: IConnectionsStore;
  messagesStore: IMessageStore;
  workspaceStore: IWorkspaceId;
}

export class RootStore implements IRootStore {
  public sourcesListStore: ISourcesListStore;
  public destinationsListStore: IDestinationsListStore;
  public sourceDefinitionsListStore: ISourceDefinitionsListStore;
  public destinationDefsListStore: IDestinationDefsListStore;
  public connectionsStore: IConnectionsStore;
  public messagesStore: IMessageStore;
  public workspaceStore: IWorkspaceId;

  constructor() {
    this.sourcesListStore = new SourcesListStore(this);
    this.destinationsListStore = new DestinationsListStore(this);
    this.sourceDefinitionsListStore = new SourceDefinitionsListStore(this);
    this.destinationDefsListStore = new DestinationDefsListStore(this);
    this.connectionsStore = new ConnectionsStore(this);
    this.messagesStore = new MessagesStore();
    this.workspaceStore = new WorkspaceId(this);
  }
}

export const stores = new RootStore();
