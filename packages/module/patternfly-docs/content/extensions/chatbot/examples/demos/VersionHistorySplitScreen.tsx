import React, { useState, FunctionComponent } from 'react';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownList,
  Flex,
  FlexItem,
  Label,
  MenuToggle,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Title,
  TextInput,
  DataList,
  DataListItem,
  DataListItemRow,
  DataListItemCells,
  DataListCell,
  DataListAction,
  Content,
  ContentVariants
} from '@patternfly/react-core';
import { CodeEditor, Language } from '@patternfly/react-code-editor';
import { RhUiAiInfoIcon } from '@patternfly/react-icons/dist/esm/icons/rh-ui-ai-info-icon';
import { CheckIcon } from '@patternfly/react-icons/dist/esm/icons/check-icon';
import { TimesIcon } from '@patternfly/react-icons/dist/esm/icons/times-icon';
import { EllipsisVIcon } from '@patternfly/react-icons/dist/esm/icons/ellipsis-v-icon';
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/chatbot/dist/css/main.css';
import './VersionHistory.css';

const sampleCode = `apiVersion: v1
kind: ConfigMap
metadata:
  name: canvas-demo
data:
  greeting: Hello, how can I help you today?
`;

interface Version {
  id: string;
  timestamp: Date;
  author: 'user' | 'bot';
  authorName: string;
  code: string;
  name: string;
}

const initialVersions: Version[] = [
  {
    id: 'v1',
    timestamp: new Date(Date.now() - 3600000 * 2),
    author: 'bot',
    authorName: 'Bot',
    code: `apiVersion: v1
kind: ConfigMap
metadata:
  name: canvas-demo
data:
  greeting: Hello, how can I help you today?
`,
    name: 'Initial configuration'
  },
  {
    id: 'v2',
    timestamp: new Date(Date.now() - 3600000),
    author: 'user',
    authorName: 'You',
    code: `apiVersion: v1
kind: ConfigMap
metadata:
  name: canvas-demo
  labels:
    app: my-app
data:
  greeting: Hello, how can I help you today?
  environment: development
`,
    name: 'Added labels and environment'
  },
  {
    id: 'v3',
    timestamp: new Date(Date.now() - 1800000),
    author: 'bot',
    authorName: 'Bot',
    code: `apiVersion: v1
kind: ConfigMap
metadata:
  name: canvas-demo
  labels:
    app: my-app
    version: "1.0"
data:
  greeting: Hello, how can I help you today?
  environment: development
  logLevel: info
`,
    name: 'Bot added version label and logLevel'
  }
];

export const VersionHistorySplitScreen: FunctionComponent = () => {
  const [code, setCode] = useState(sampleCode);
  const [versions, setVersions] = useState<Version[]>(initialVersions);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(initialVersions[2].id);
  const [editingVersionId, setEditingVersionId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [openMenuVersionId, setOpenMenuVersionId] = useState<string | null>(null);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [versionToRestore, setVersionToRestore] = useState<Version | null>(null);
  const [previewCode, setPreviewCode] = useState<string>(initialVersions[2].code);

  const handleVersionSelect = (versionId: string) => {
    setSelectedVersionId(versionId);
    const version = versions.find((v) => v.id === versionId);
    if (version) {
      setPreviewCode(version.code);
    }
  };

  const handleRestoreVersion = (versionId: string) => {
    const version = versions.find((v) => v.id === versionId);
    if (version) {
      setVersionToRestore(version);
      setIsRestoreModalOpen(true);
      setOpenMenuVersionId(null);
    }
  };

  const confirmRestore = () => {
    if (versionToRestore) {
      setCode(versionToRestore.code);
      setIsRestoreModalOpen(false);
      setVersionToRestore(null);
    }
  };

  const cancelRestore = () => {
    setIsRestoreModalOpen(false);
    setVersionToRestore(null);
  };

  const formatModalTimestamp = (timestamp: Date) => {
    return (
      timestamp.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric'
      }) +
      ' at ' +
      timestamp.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    );
  };

  const handleStartRename = (versionId: string, currentName: string) => {
    setEditingVersionId(versionId);
    setEditingName(currentName);
    setOpenMenuVersionId(null);
  };

  const handleSaveRename = (versionId: string) => {
    setVersions((prev) => prev.map((v) => (v.id === versionId ? { ...v, name: editingName } : v)));
    setEditingVersionId(null);
    setEditingName('');
  };

  const handleCancelRename = () => {
    setEditingVersionId(null);
    setEditingName('');
  };

  const handleDuplicateVersion = (versionId: string) => {
    const version = versions.find((v) => v.id === versionId);
    if (version) {
      const newVersion: Version = {
        ...version,
        id: `v${Date.now()}`,
        name: `${version.name} (copy)`,
        timestamp: new Date()
      };
      setVersions((prev) => [newVersion, ...prev]);
    }
    setOpenMenuVersionId(null);
  };

  const handleMenuToggle = (versionId: string) => {
    setOpenMenuVersionId((prev) => (prev === versionId ? null : versionId));
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return timestamp.toLocaleString();
  };

  const selectedVersion = versions.find((v) => v.id === selectedVersionId);

  const versionHistoryPanel = (
    <div className="version-history-panel">
      <div className="version-history-header">
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem>
            <Title headingLevel="h2" size="lg">
              Version History
            </Title>
          </FlexItem>
        </Flex>
      </div>

      <div className="version-history-content">
        <DataList aria-label="Version history list" isCompact>
          {[...versions]
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .map((version) => (
              <DataListItem
                key={version.id}
                id={version.id}
                aria-labelledby={`version-${version.id}`}
                isExpanded={selectedVersionId === version.id}
                className={selectedVersionId === version.id ? 'pf-m-selected' : ''}
                onClick={() => handleVersionSelect(version.id)}
              >
                <DataListItemRow>
                  <DataListItemCells
                    dataListCells={[
                      <DataListCell key="primary">
                        {editingVersionId === version.id ? (
                          <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                            <FlexItem flex={{ default: 'flex_1' }}>
                              <TextInput
                                value={editingName}
                                onChange={(_event, value) => setEditingName(value)}
                                aria-label="Version name"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveRename(version.id);
                                  if (e.key === 'Escape') handleCancelRename();
                                }}
                              />
                            </FlexItem>
                            <FlexItem>
                              <Button
                                variant="plain"
                                aria-label="Save name"
                                icon={<CheckIcon />}
                                onClick={() => handleSaveRename(version.id)}
                              />
                            </FlexItem>
                            <FlexItem>
                              <Button
                                variant="plain"
                                aria-label="Cancel rename"
                                icon={<TimesIcon />}
                                onClick={handleCancelRename}
                              />
                            </FlexItem>
                          </Flex>
                        ) : (
                          <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsXs' }}>
                            <FlexItem>
                              <Content component={ContentVariants.p} className="pf-v6-u-font-weight-bold">
                                {version.name}
                              </Content>
                            </FlexItem>
                            <FlexItem>
                              <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                                <FlexItem>
                                  <Content component={ContentVariants.small}>
                                    {version.author === 'bot' ? 'Bot' : 'You'} · {formatTimestamp(version.timestamp)}
                                  </Content>
                                </FlexItem>
                                {version.author === 'bot' && (
                                  <FlexItem>
                                    <Label isCompact variant="outline">
                                      AI
                                    </Label>
                                  </FlexItem>
                                )}
                              </Flex>
                            </FlexItem>
                          </Flex>
                        )}
                      </DataListCell>
                    ]}
                  />
                  {editingVersionId !== version.id && (
                    <DataListAction
                      aria-labelledby={`version-${version.id}`}
                      id={`version-action-${version.id}`}
                      aria-label="Version actions"
                    >
                      <Dropdown
                        isOpen={openMenuVersionId === version.id}
                        onOpenChange={(isOpen) => setOpenMenuVersionId(isOpen ? version.id : null)}
                        toggle={(toggleRef) => (
                          <MenuToggle
                            ref={toggleRef}
                            variant="plain"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMenuToggle(version.id);
                            }}
                            isExpanded={openMenuVersionId === version.id}
                            aria-label="Version options"
                          >
                            <EllipsisVIcon />
                          </MenuToggle>
                        )}
                        popperProps={{ position: 'right' }}
                      >
                        <DropdownList>
                          <DropdownItem key="name" onClick={() => handleStartRename(version.id, version.name)}>
                            Name this version
                          </DropdownItem>
                          <DropdownItem key="restore" onClick={() => handleRestoreVersion(version.id)}>
                            Restore this version
                          </DropdownItem>
                          <DropdownItem key="duplicate" onClick={() => handleDuplicateVersion(version.id)}>
                            Duplicate
                          </DropdownItem>
                        </DropdownList>
                      </Dropdown>
                    </DataListAction>
                  )}
                </DataListItemRow>
              </DataListItem>
            ))}
        </DataList>
      </div>
    </div>
  );

  return (
    <>
      <Modal
        isOpen={isRestoreModalOpen}
        onClose={cancelRestore}
        aria-labelledby="restore-modal-title"
        aria-describedby="restore-modal-body"
        variant="small"
        appendTo={document.body}
      >
        <ModalHeader title="Restore this version?" labelId="restore-modal-title" />
        <ModalBody id="restore-modal-body">
          {versionToRestore && (
            <p>
              Your current document will revert to the version from {formatModalTimestamp(versionToRestore.timestamp)}.
            </p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button key="cancel" variant="link" onClick={cancelRestore}>
            Cancel
          </Button>
          <Button key="restore" variant="primary" onClick={confirmRestore}>
            Restore
          </Button>
        </ModalFooter>
      </Modal>

      <div className="version-history-split-screen-demo">
        {/* Left side: Canvas/Code Editor */}
        <div className="version-history-split-canvas pf-chatbot__canvas-panel">
          <section className="pf-chatbot__canvas-section" tabIndex={-1} aria-label="Canvas">
            <div className="pf-chatbot__canvas-head">
              <Flex
                justifyContent={{ default: 'justifyContentSpaceBetween' }}
                alignItems={{ default: 'alignItemsCenter' }}
              >
                <Flex spaceItems={{ default: 'spaceItemsMd' }} alignItems={{ default: 'alignItemsCenter' }}>
                  <FlexItem>
                    <Title headingLevel="h2" size="lg">
                      {selectedVersion?.name || 'Edit code'}
                    </Title>
                  </FlexItem>
                  <FlexItem>
                    <Label variant="outline" icon={<RhUiAiInfoIcon aria-hidden />}>
                      Preview mode
                    </Label>
                  </FlexItem>
                </Flex>
              </Flex>
            </div>
            <div className="pf-chatbot__canvas-panel-body">
              <div className="pf-chatbot__canvas-editor">
                <CodeEditor
                  isFullHeight
                  isLineNumbersVisible
                  isLanguageLabelVisible
                  isReadOnly
                  code={previewCode}
                  language={Language.yaml}
                />
              </div>
            </div>
          </section>
        </div>

        {/* Right side: Version History Panel */}
        <div className="version-history-split-panel">{versionHistoryPanel}</div>
      </div>
    </>
  );
};
