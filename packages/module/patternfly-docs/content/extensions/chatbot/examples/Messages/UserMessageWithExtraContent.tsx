import { useState, FunctionComponent } from 'react';

import Message from '@patternfly/chatbot/dist/dynamic/Message';
import userAvatar from './user_avatar.svg';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  ExpandableSection,
  ExpandableSectionToggle,
  Flex,
  FlexItem,
  Label,
  Tab,
  Tabs,
  TabTitleText
} from '@patternfly/react-core';
import { CubeIcon, CubesIcon } from '@patternfly/react-icons';

const VersionSelectorCard = () => {
  const [activeTabKey, setActiveTabKey] = useState<string | number>(0);
  const [isCardSelected, setIsCardSelected] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const id1 = '4.20';
  const id2 = '4.19';
  const id3 = '4.18';
  const id4 = '4.17';

  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    setIsCardSelected(event.currentTarget.id);
  };

  const onToggleExpandableSection = (isExpanded: boolean) => {
    setIsExpanded(isExpanded);
  };

  const handleTabClick = (_event: any, tabIndex: string | number) => {
    setActiveTabKey(tabIndex);
  };

  const contentId = 'detached-expandable-section-content';
  const toggleId = 'detached-expandable-section-toggle';

  const generateTabContent = (title: string, subtitle: string) => (
    <Flex direction={{ default: 'column' }} alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }}>
      <FlexItem
        alignSelf={{ default: 'alignSelfCenter' }}
        style={{ marginBlockStart: 'var(--pf-t--global--spacer--md)', textAlign: 'center' }}
      >
        <div style={{ fontWeight: 'var(--pf-t--global--font--weight--heading--bold)' }}>{title}</div>
        <div>{subtitle}</div>
      </FlexItem>
      <FlexItem alignSelf={{ default: 'alignSelfStretch' }}>
        <Card id="4.20-card" isSelectable isSelected={isCardSelected === id1}>
          <CardHeader
            selectableActions={{
              selectableActionId: id1,
              selectableActionAriaLabelledby: '4.20-card',
              name: 'version',
              variant: 'single',
              onChange,
              isHidden: true
            }}
          >
            <CardTitle>
              <Flex spaceItems={{ default: 'spaceItemsXs' }}>
                <FlexItem>4.20.0-ec.3</FlexItem>
                <FlexItem>
                  <Label color={isCardSelected === id1 ? 'blue' : undefined}>Preview</Label>
                </FlexItem>
              </Flex>
            </CardTitle>
          </CardHeader>
          <CardBody>Developer preview • Not for production</CardBody>
        </Card>
      </FlexItem>
      <FlexItem alignSelf={{ default: 'alignSelfStretch' }}>
        <Card id="4.19-card" isSelectable isSelected={isCardSelected === id2}>
          <CardHeader
            selectableActions={{
              selectableActionId: id2,
              selectableActionAriaLabelledby: '4.19-card',
              name: 'version',
              variant: 'single',
              onChange,
              isHidden: true
            }}
          >
            <CardTitle>
              <Flex spaceItems={{ default: 'spaceItemsXs' }}>
                <FlexItem>4.19.2</FlexItem>
                <FlexItem>
                  <Label color={isCardSelected === id2 ? 'blue' : undefined}>Latest</Label>
                </FlexItem>
              </Flex>
            </CardTitle>
          </CardHeader>
          <CardBody>Newest features • 18-month support • Recommended</CardBody>
        </Card>
      </FlexItem>
      <FlexItem alignSelf={{ default: 'alignSelfStretch' }}>
        <Card id="4.18-card" isSelectable isSelected={isCardSelected === id3}>
          <CardHeader
            selectableActions={{
              selectableActionId: id3,
              selectableActionAriaLabelledby: '4.18-card',
              name: 'version',
              variant: 'single',
              onChange,
              isHidden: true
            }}
          >
            <CardTitle>4.18.19</CardTitle>
          </CardHeader>
          <CardBody>Previous stable • Full support</CardBody>
        </Card>
        <ExpandableSection isExpanded={isExpanded} isDetached toggleId={toggleId} contentId={contentId}>
          <Flex
            direction={{ default: 'column' }}
            alignItems={{ default: 'alignItemsCenter' }}
            gap={{ default: 'gapMd' }}
          >
            <FlexItem alignSelf={{ default: 'alignSelfStretch' }}>
              <Card
                id="4.17-card"
                isSelectable
                isSelected={isCardSelected === id4}
                style={{ marginBlockStart: 'var(--pf-t--global--spacer--md)' }}
              >
                <CardHeader
                  selectableActions={{
                    selectableActionId: id4,
                    selectableActionAriaLabelledby: '4.17-card',
                    name: 'version',
                    variant: 'single',
                    onChange,
                    isHidden: true
                  }}
                >
                  <CardTitle>
                    <Flex spaceItems={{ default: 'spaceItemsXs' }}>
                      <FlexItem>4.17.34</FlexItem>
                      <FlexItem>
                        <Label color={isCardSelected === id4 ? 'blue' : undefined}>Maintenance</Label>
                      </FlexItem>
                    </Flex>
                  </CardTitle>
                </CardHeader>
                <CardBody>Maintenance support phase</CardBody>
              </Card>
            </FlexItem>
          </Flex>
        </ExpandableSection>
      </FlexItem>
      <FlexItem>
        <ExpandableSectionToggle
          isExpanded={isExpanded}
          onToggle={onToggleExpandableSection}
          toggleId={toggleId}
          contentId={contentId}
          direction="up"
        >
          {isExpanded ? 'Hide older versions' : 'Show older versions'}
        </ExpandableSectionToggle>
      </FlexItem>
    </Flex>
  );

  return (
    <Card ouiaId="VersionSelectorCard">
      <CardBody>
        <Tabs activeKey={activeTabKey} onSelect={handleTabClick} aria-label="Architecture" role="region" isFilled>
          <Tab
            eventKey={0}
            title={
              <TabTitleText>
                <Flex spaceItems={{ default: 'spaceItemsXs' }}>
                  <FlexItem>
                    <CubeIcon />
                  </FlexItem>
                  <FlexItem>Single arch</FlexItem>
                </Flex>
              </TabTitleText>
            }
          >
            {generateTabContent('x86_64 Intel/AMD only', 'Standard deployments • Most common choice')}
          </Tab>
          <Tab
            eventKey={1}
            title={
              <TabTitleText>
                <Flex spaceItems={{ default: 'spaceItemsXs' }}>
                  <FlexItem>
                    <CubesIcon />
                  </FlexItem>
                  <FlexItem>Multi arch</FlexItem>
                </Flex>
              </TabTitleText>
            }
          >
            {generateTabContent('Multi arch', 'Standard deployments')}
          </Tab>
        </Tabs>
      </CardBody>
      <CardFooter>
        <Button isBlock isDisabled={isCardSelected === ''}>
          Continue with selections
        </Button>
      </CardFooter>
    </Card>
  );
};

export const UserMessageWithExtraContent: FunctionComponent = () => (
  <>
    <Message
      avatar={userAvatar}
      name="User"
      role="user"
      content="This is a message with a version selector card."
      timestamp="1 hour ago"
      extraContent={{
        afterMainContent: <VersionSelectorCard />
      }}
    />
  </>
);
