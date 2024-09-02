import { HeaderDiv, LabelSmall, Text } from '@components/common/typography';
import DestinationsList from '@components/destinationsList';
import SourcesList from '@components/sourcesList';
import theme from '@css/theme';
import { IDestinationsListStore } from '@stores/destinationsList';
import { ISourceDefinitionsListStore } from '@stores/sourceDefinitionsList';
import { ISourcesListStore } from '@stores/sourcesList';
import { IConnectionsStore } from '@stores/connections';
import { IWorkspaceId } from '@stores/workspaceId';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';

import {
  BodyContainer,
  Container,
  Heading,
  ImportConfigContainer,
  ImportInputButton,
} from './styles';
import { Flex } from '@components/common/misc';
import { ButtonSmall } from '@components/common/button';
import { IDestinationDefsListStore } from '../../stores/destinationDefsList';
import { ButtonPrimary } from '../common/button';
import { version } from '@services/version';
import { apiServerCaller } from '@services/apiCaller';
var fileDownload = require('js-file-download');

declare var LeaderLine: any;

interface IConnectionsProps {
  sourcesListStore: ISourcesListStore;
  destinationsListStore: IDestinationsListStore;
  sourceDefinitionsListStore: ISourceDefinitionsListStore;
  destinationDefsListStore: IDestinationDefsListStore;
  connectionsStore: IConnectionsStore;
  workspaceStore: IWorkspaceId;
}

@inject(
  'sourcesListStore',
  'destinationsListStore',
  'sourceDefinitionsListStore',
  'destinationDefsListStore',
  'connectionsStore',
  'workspaceStore',
)
@observer
class Connections extends Component<IConnectionsProps, any> {
  linesMap: any;

  constructor(props: IConnectionsProps) {
    super(props);
    this.linesMap = {};
    this.state = {};
  }

  componentDidMount() {
    this.drawSourceConnectionLines();
  }

  componentWillUnmount() {
    this.removeSourceConnectionLines();
  }

  drawSourceConnectionLines = () => {
    let existingCombos = Object.keys(this.linesMap);
    let combos: string[] = [];
    this.props.sourcesListStore!.sources.forEach(source => {
      source.destinations.forEach(dest =>
        combos.push(`${source.id}-${dest.id}`),
      );
    });
    existingCombos.forEach(c => {
      if (!combos.includes(c)) {
        this.linesMap[c].remove();
      }
    });
    combos.forEach(c => {
      if (!existingCombos.includes(c)) {
        let line = new LeaderLine(
          document.getElementById(`fake-source-${c.split('-')[0]}`),
          document.getElementById(`fake-destination-${c.split('-')[1]}`),
          { endPlug: 'behind', color: theme.color.grey100, size: 4 },
        );
        this.linesMap[c] = line;
      }
    });
  };

  removeSourceConnectionLines = () => {
    Object.values(this.linesMap).forEach((l: any) => l.remove());
  };

  buildWorkspaceConfig = () => {
    const workspaceConfig = {
      workspaceId: this.props.workspaceStore.workspaceId,
      sources: [] as any,
      metadata: {
        sourceListStore: this.props.sourcesListStore.returnWithoutRootStore(),
        destinationListStore: this.props.destinationsListStore.returnWithoutRootStore(),
        connectionsStore: this.props.connectionsStore.returnWithoutRootStore(),
        version,
      },
    };

    this.props.sourcesListStore!.sources.forEach(source => {
      let obj = {
        config: source.config,
        id: source.id,
        name: source.name,
        writeKey: source.writeKey,
        enabled: source.enabled,
        workspaceId: this.props.workspaceStore.workspaceId,
        sourceDefinitionId: source.sourceDefinitionId,
        deleted: false,
        createdAt: Date(),
        updatedAt: Date(),
        sourceDefinition: source.sourceDef,
        destinations: source.destinations.map(dest => {
          return {
            ...dest,
            workspaceId: this.props.workspaceStore.workspaceId,
            isProcessorEnabled:
              dest.enabled &&
              source.enabled &&
              !dest.config.useNativeSDK &&
              !dest.destinationDefinition.config.deviceModeOnly,
            rootStore: null,
          };
        }),
      };
      workspaceConfig.sources.push(obj);
    });
    return workspaceConfig;
  };

  handleExportWorkspaceConfig = () => {
    const workspaceConfig = this.buildWorkspaceConfig();
    fileDownload(
      JSON.stringify(workspaceConfig, null, 2),
      'workspaceConfig.json',
    );
  };

  handleSaveWorkspaceConfig = () => {
    const workspaceConfig = this.buildWorkspaceConfig();
    apiServerCaller().post('/saveToFile', { workspaceConfig });
  };

  handleFileChosen = (event: any) => {
    const file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.onloadend = e => {
      const content = fileReader.result;
      this.setupWorkspace(content);
    };
    fileReader.readAsText(file);
  };

  setupWorkspace = (jsonContent: any) => {
    const content = JSON.parse(jsonContent);
    this.props.sourcesListStore!.loadImportedFile(
      content.metadata.sourceListStore.sources,
    );
    this.props.destinationsListStore!.loadImportedFile(
      content.metadata.destinationListStore.destinations,
    );
    this.props.connectionsStore!.loadImportedFile(
      content.metadata.connectionsStore.connections,
    );
    this.props.connectionsStore!.setConnections(content.sources);
    this.props.workspaceStore!.loadImportedFile(content.workspaceId!);
  };

  public render() {
    const isSaveToFileEnabled =
      (process.env.REACT_APP_IS_SAVE_TO_FILE_ENABLED || '').toLowerCase() ===
      'true';
    return (
      <Container>
        <Flex flexDirection="column">
          <Heading>
            <Flex flexDirection="row" spaceBetween>
              <HeaderDiv color={theme.color.primary}>Connections</HeaderDiv>
              <Flex
                flexDirection="row"
                style={{ justifyContent: 'space-around' }}
              >
                <ButtonPrimary
                  onClick={this.handleExportWorkspaceConfig}
                  style={{ height: '40px', fontSize: theme.fontSize.sm }}
                >
                  Export
                </ButtonPrimary>

                {isSaveToFileEnabled && (
                  <ButtonPrimary
                    className="m-l-sm"
                    onClick={this.handleSaveWorkspaceConfig}
                    style={{ height: '40px', fontSize: theme.fontSize.sm }}
                  >
                    Save
                  </ButtonPrimary>
                )}

                <ImportInputButton
                  type="file"
                  name="file"
                  onChange={this.handleFileChosen}
                  id="myuniqueid"
                />
                <ImportConfigContainer htmlFor="myuniqueid">
                  IMPORT
                </ImportConfigContainer>
              </Flex>
            </Flex>
          </Heading>
          <BodyContainer>
            <SourcesList linesMap={this.linesMap} />
            <DestinationsList linesMap={this.linesMap} />
          </BodyContainer>
        </Flex>
      </Container>
    );
  }
}

export default Connections;
