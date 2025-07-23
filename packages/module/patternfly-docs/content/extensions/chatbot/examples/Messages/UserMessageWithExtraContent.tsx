import { useState, Fragment, FunctionComponent } from 'react';

import Message from '@patternfly/chatbot/dist/dynamic/Message';
import userAvatar from './user_avatar.svg';
import {
  Alert,
  Badge,
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
  Tab,
  Tabs,
  TabTitleText
} from '@patternfly/react-core';
import { CubeIcon } from '@patternfly/react-icons';

const UserActionEndContent = () => {
  // eslint-disable-next-line no-console
  const onClick = () => console.log('custom button click');
  return (
    <Fragment>
      <Button variant="secondary" ouiaId="Secondary" onClick={onClick}>
        End content button
      </Button>
      <Alert variant="danger" title="Danger alert title" ouiaId="DangerAlert" />
    </Fragment>
  );
};

const BeforeMainContent = () => (
  <div>
    <Badge key={1} isRead>
      7
    </Badge>
    <Badge key={2} isRead>
      24
    </Badge>
  </div>
);

export const UserMessageWithExtraContent: FunctionComponent = () => {
  const [activeTabKey, setActiveTabKey] = useState<string | number>(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isChecked, setIsChecked] = useState('');
  const id1 = 'single-selectable-card-input-1';
  const id2 = 'single-selectable-card-input-2';
  const id3 = 'single-selectable-card-input-3';
  const id4 = 'single-selectable-card-input-4';

  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    setIsChecked(event.currentTarget.id);
  };

  const onToggle = (isExpanded: boolean) => {
    setIsExpanded(isExpanded);
  };

  const handleTabClick = (_event: any, tabIndex: string | number) => {
    setActiveTabKey(tabIndex);
  };

  const contentId = 'detached-expandable-section-content';
  const toggleId = 'detached-expandable-section-toggle';

  const CardInformationAfterMainContent = () => (
    <Card ouiaId="BasicCard">
      <CardBody>
        <Tabs
          activeKey={activeTabKey}
          onSelect={handleTabClick}
          aria-label="Tabs in the horizontal overflow example"
          role="region"
          isFilled
        >
          <Tab
            eventKey={0}
            title={
              <TabTitleText>
                <CubeIcon /> Single arch
              </TabTitleText>
            }
            aria-label="Horizontal overflow content users"
          >
            <Flex
              direction={{ default: 'column' }}
              alignItems={{ default: 'alignItemsCenter' }}
              gap={{ default: 'gapMd' }}
            >
              <FlexItem
                alignSelf={{ default: 'alignSelfCenter' }}
                style={{ marginBlockStart: '20px', textAlign: 'center' }}
              >
                <div style={{ fontWeight: 'bold' }}>x86_64 Intel/AMD only</div>
                <div>Standard deployments • Most common choice</div>
              </FlexItem>
              <FlexItem alignSelf={{ default: 'alignSelfStretch' }}>
                <Card id="single-selectable-card-example-1" isSelectable isSelected={isChecked === id1}>
                  <CardHeader
                    selectableActions={{
                      selectableActionId: id1,
                      selectableActionAriaLabelledby: 'single-selectable-card-example-1',
                      name: 'single-selectable-card-example',
                      variant: 'single',
                      onChange,
                      hasNoOffset: true
                    }}
                  >
                    <CardTitle>First card</CardTitle>
                  </CardHeader>
                  <CardBody>Body</CardBody>
                  <CardFooter>Footer</CardFooter>
                </Card>
              </FlexItem>
              <FlexItem alignSelf={{ default: 'alignSelfStretch' }}>
                <Card id="single-selectable-card-example-2" isSelectable isSelected={isChecked === id2}>
                  <CardHeader
                    selectableActions={{
                      selectableActionId: id2,
                      selectableActionAriaLabelledby: 'single-selectable-card-example-2',
                      name: 'single-selectable-card-example',
                      variant: 'single',
                      onChange,
                      hasNoOffset: true
                    }}
                  >
                    <CardTitle>Second card</CardTitle>
                  </CardHeader>
                  <CardBody>Body</CardBody>
                  <CardFooter>Footer</CardFooter>
                </Card>
              </FlexItem>
              <FlexItem alignSelf={{ default: 'alignSelfStretch' }}>
                <Card id="single-selectable-card-example-3" isSelectable isDisabled isSelected={isChecked === id3}>
                  <CardHeader
                    selectableActions={{
                      selectableActionId: id3,
                      selectableActionAriaLabelledby: 'single-selectable-card-example-3',
                      name: 'single-selectable-card-example',
                      variant: 'single',
                      onChange,
                      hasNoOffset: true
                    }}
                  >
                    <CardTitle>Third card</CardTitle>
                  </CardHeader>
                  <CardBody>Body</CardBody>
                  <CardFooter>Footer</CardFooter>
                </Card>
                <ExpandableSection isExpanded={isExpanded} isDetached toggleId={toggleId} contentId={contentId}>
                  <Flex
                    direction={{ default: 'column' }}
                    alignItems={{ default: 'alignItemsCenter' }}
                    gap={{ default: 'gapMd' }}
                  >
                    <FlexItem alignSelf={{ default: 'alignSelfStretch' }}>
                      <Card
                        id="single-selectable-card-example-4"
                        isSelectable
                        isSelected={isChecked === id4}
                        style={{ marginBlockStart: '20px' }}
                      >
                        <CardHeader
                          selectableActions={{
                            selectableActionId: id4,
                            selectableActionAriaLabelledby: 'single-selectable-card-example-4',
                            name: 'single-selectable-card-example',
                            variant: 'single',
                            onChange,
                            hasNoOffset: true
                          }}
                        >
                          <CardTitle>Fourth card</CardTitle>
                        </CardHeader>
                        <CardBody>Body</CardBody>
                        <CardFooter>Footer</CardFooter>
                      </Card>
                    </FlexItem>
                  </Flex>
                </ExpandableSection>
              </FlexItem>
              <FlexItem>
                <ExpandableSectionToggle
                  isExpanded={isExpanded}
                  onToggle={onToggle}
                  toggleId={toggleId}
                  contentId={contentId}
                  direction="up"
                >
                  {isExpanded ? 'Hide older versions' : 'Show older versions'}
                </ExpandableSectionToggle>
              </FlexItem>
            </Flex>
          </Tab>
          <Tab eventKey={1} title={<TabTitleText>Multi arch</TabTitleText>}>
            Multi arch
          </Tab>
        </Tabs>
      </CardBody>
      <CardFooter>
        <Button isBlock>Continue with selections</Button>
      </CardFooter>
    </Card>
  );

  return (
    <>
      <Message
        avatar={userAvatar}
        name="User"
        role="user"
        content="This is a main message."
        timestamp="1 hour ago"
        extraContent={{
          beforeMainContent: <BeforeMainContent />,
          afterMainContent: <CardInformationAfterMainContent />,
          endContent: <UserActionEndContent />
        }}
      />
    </>
  );
};
