import { Fragment, FunctionComponent, useState, useEffect } from 'react';
import Message from '@patternfly/chatbot/dist/dynamic/Message';
import userAvatar from './user_avatar.svg';
import patternflyAvatar from '../Messages/patternfly_avatar.jpg';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionToggle,
  Alert,
  Badge,
  Button,
  ButtonVariant,
  Card,
  CardBody,
  CardExpandableContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CodeBlock,
  CodeBlockCode,
  Content,
  ContentVariants,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Flex,
  FlexItem,
  HelperText,
  HelperTextItem,
  Icon,
  Progress,
  ProgressMeasureLocation,
  ExpandableSection,
  ExpandableSectionToggle,
  Label,
  Tab,
  Tabs,
  TabTitleText,
  Spinner
} from '@patternfly/react-core';
import { ArrowCircleDownIcon, ArrowRightIcon, CheckCircleIcon, CubeIcon, CubesIcon } from '@patternfly/react-icons';

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

const CardInformationAfterMainContent = () => (
  <Card ouiaId="BasicCard">
    <CardTitle>This is content card after main content</CardTitle>
    <CardBody>Body</CardBody>
    <CardFooter>Footer</CardFooter>
  </Card>
);

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

interface Stage {
  id: string;
  name: string;
  startProgress: number;
  endProgress: number;
}

const LiveProgressSummaryCard = () => {
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [isAccordionExpanded, setIsAccordionExpanded] = useState('installing-toggle');
  const [progress, setProgress] = useState(15);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [userManuallyExpandedAccordion, setUserManuallyExpandedAccordion] = useState(false);

  const stages: Stage[] = [
    {
      id: 'installing-toggle',
      name: 'Installing cluster bootstrap',
      startProgress: 0,
      endProgress: 25
    },
    {
      id: 'setup-toggle',
      name: 'Control plane setup',
      startProgress: 25,
      endProgress: 45
    },
    {
      id: 'deploying-toggle',
      name: 'Deploying cluster operators',
      startProgress: 45,
      endProgress: 85
    },
    {
      id: 'finalizing-toggle',
      name: 'Finalizing installation',
      startProgress: 85,
      endProgress: 100
    }
  ];

  const getCurrentStage = () =>
    stages.find((stage) => progress >= stage.startProgress && progress < stage.endProgress) ||
    stages[stages.length - 1];

  const getTimeRemaining = () => {
    const remainingProgress = 100 - progress;
    const estimatedMinutes = Math.max(1, Math.round((remainingProgress / 100) * 30)); // 30 minutes total simulation
    return `About ${estimatedMinutes} minute${estimatedMinutes !== 1 ? 's' : ''} remaining`;
  };

  const getCurrentStageName = () => {
    const currentStage = getCurrentStage();
    return currentStage.name;
  };

  const getStageStatus = (stage: Stage) => {
    if (progress >= stage.endProgress) {
      return 'completed';
    }
    if (progress >= stage.startProgress) {
      return 'in-progress';
    }
    return 'pending';
  };

  const renderStageIcon = (stage: Stage) => {
    const status = getStageStatus(stage);

    if (status === 'completed') {
      return <CheckCircleIcon color="green" aria-label="Complete" />;
    } else if (status === 'in-progress') {
      return <Spinner size="sm" aria-valuetext="In progress" />;
    } else {
      return <div style={{ width: 'var(--pf-t--global--spacer--md)' }}>{/* Empty space for pending stages */}</div>;
    }
  };

  // Auto-increment progress when simulation is running
  useEffect(() => {
    let interval;

    if (isSimulationRunning && progress < 100) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const increment = Math.random() * 2 + 0.5; // Random increment between 0.5-2.5%
          const newProgress = Math.min(prev + increment, 100);

          // Stop simulation when complete
          if (newProgress >= 100) {
            setIsSimulationRunning(false);
            setUserManuallyExpandedAccordion(false); // Reset manual override when simulation completes
          }

          return newProgress;
        });
      }, 800);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isSimulationRunning, progress]);

  // Auto-expand accordion to show current stage (only if user hasn't manually overridden)
  useEffect(() => {
    if (isSimulationRunning && !userManuallyExpandedAccordion) {
      setIsAccordionExpanded(getCurrentStage().id);
    }
  }, [progress, isSimulationRunning, userManuallyExpandedAccordion]);

  const onExpandCard = (_event: React.MouseEvent) => {
    setIsCardExpanded(!isCardExpanded);
  };

  const onExpandAccordion = (id: string) => {
    setUserManuallyExpandedAccordion(true);

    if (id === isAccordionExpanded) {
      setIsAccordionExpanded('');
    } else {
      setIsAccordionExpanded(id);
    }
  };

  const getStageContent = (stage: Stage) => {
    const status = getStageStatus(stage);

    if (status === 'in-progress') {
      switch (stage.id) {
        case 'installing-toggle':
          return `Installing bootstrap node...
Installing etcd cluster...
Installing control plane...`;
        case 'setup-toggle':
          return `Configuring cluster networking...
Setting up OpenShift API server...
Configuring authentication...
Setting up cluster operators...`;
        case 'deploying-toggle':
          return `Deploying openshift-apiserver operator...
Deploying openshift-sdn operator...
Deploying openshift-ingress operator...
`;
        case 'finalizing-toggle':
          return `Finalizing cluster configuration...
Running post-installation tasks...
Setting up cluster console...`;
      }
    }
    if (status === 'pending') {
      return 'Processing...';
    }
    return 'Complete!';
  };

  const renderCodeBlock = (stage: Stage) => (
    <CodeBlock
      style={
        {
          '--pf-v6-c-code-block--BackgroundColor': 'var(--pf-t--color--gray--95)',
          '--pf-v6-c-code-block--BorderRadius': 'var(--pf-t--global--border--radius--small)'
        } as React.CSSProperties
      }
    >
      <CodeBlockCode>{getStageContent(stage)}</CodeBlockCode>
    </CodeBlock>
  );

  return (
    <>
      <Flex className="pf-v6-u-mt-lg" spaceItems={{ default: 'spaceItemsSm' }}>
        <FlexItem>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setProgress(15);
              setIsSimulationRunning(true);
              setUserManuallyExpandedAccordion(false);
            }}
            isDisabled={isSimulationRunning}
          >
            {isSimulationRunning ? 'Simulation running...' : 'Start simulation of cluster installation progress'}
          </Button>
        </FlexItem>
        <FlexItem>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setIsSimulationRunning(false);
              setProgress(15);
              setIsAccordionExpanded('installing-toggle');
              setUserManuallyExpandedAccordion(false);
            }}
          >
            Reset
          </Button>
        </FlexItem>
      </Flex>
      <Card ouiaId="LiveProgressSummaryCard" isExpanded={isCardExpanded}>
        <CardHeader
          onExpand={onExpandCard}
          isToggleRightAligned
          toggleButtonProps={{
            id: 'toggle-button1',
            'aria-label': 'Details',
            'aria-labelledby': 'expandable-card-title toggle-button1',
            'aria-expanded': isCardExpanded
          }}
        >
          <DescriptionList>
            <DescriptionListGroup
              style={
                {
                  '--pf-v6-c-description-list__group--RowGap': 'var(--pf-t--global--spacer--md)'
                } as React.CSSProperties
              }
            >
              <DescriptionListTerm id="title-outside-progress-example-label">
                OpenShift cluster installation
              </DescriptionListTerm>
              <DescriptionListDescription>
                <Progress
                  aria-labelledby="title-outside-progress-example-label"
                  value={progress}
                  measureLocation={ProgressMeasureLocation.outside}
                  style={{ '--pf-v6-c-progress--GridGap': 'var(--pf-t--global--spacer--sm' } as React.CSSProperties}
                  helperText={
                    <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                      <FlexItem>
                        <HelperText>
                          <HelperTextItem>
                            {progress >= 100 ? 'Installation complete!' : getCurrentStageName()}
                          </HelperTextItem>
                        </HelperText>
                      </FlexItem>
                      <FlexItem>
                        <HelperText>
                          {/* Progress was getting announced on VoiceOver constantly - this helps avoid that */}
                          <HelperTextItem aria-live="off">
                            {progress >= 100 ? 'Completed' : getTimeRemaining()}
                          </HelperTextItem>
                        </HelperText>
                      </FlexItem>
                    </Flex>
                  }
                />
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </CardHeader>
        <CardExpandableContent>
          <CardBody>
            <hr
              style={
                {
                  border: 'none',
                  height: 'var(--pf-t--global--border--width--divider--default)',
                  backgroundColor: 'var(--pf-t--global--border--color--control--read-only)'
                } as React.CSSProperties
              }
              className="pf-v6-u-mb-md"
            />
            <Accordion
              style={
                {
                  '--pf-v6-c-accordion__expandable-content-body--PaddingBlockStart': 'var(--pf-t--global--spacer--md)',
                  '--pf-v6-c-accordion__expandable-content-body--PaddingBlockEnd': '0',
                  '--pf-v6-c-accordion__expandable-content-body--PaddingInlineStart': '0',
                  '--pf-v6-c-accordion__expandable-content-body--PaddingInlineEnd': '0',
                  '--pf-v6-c-accordion__expandable-content--BackgroundColor': 'initial',
                  '--pf-v6-c-accordion__expandable-content--Color': '#fff'
                } as React.CSSProperties
              }
            >
              {stages.map((stage) => (
                <AccordionItem key={stage.id} isExpanded={isAccordionExpanded === stage.id}>
                  <AccordionToggle
                    onClick={() => {
                      onExpandAccordion(stage.id);
                    }}
                    id={stage.id}
                  >
                    <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                      <FlexItem>{renderStageIcon(stage)}</FlexItem>
                      <FlexItem>{stage.name}</FlexItem>
                    </Flex>
                  </AccordionToggle>
                  <AccordionContent id={stage.id.replace('-toggle', '')} style={{ border: '0px' }}>
                    {renderCodeBlock(stage)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardBody>
        </CardExpandableContent>
        <CardFooter>
          <Button isBlock variant="tertiary" icon={<ArrowRightIcon />} iconPosition="end">
            Open in console
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

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
      <FlexItem alignSelf={{ default: 'alignSelfCenter' }} className="pf-v6-u-mt-md pf-v6-u-text-align-center">
        <div className="pf-v6-u-font-weight-bold">{title}</div>
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
              <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                <FlexItem>4.20.0-ec.3</FlexItem>
                <FlexItem>
                  <Label isCompact color={isCardSelected === id1 ? 'blue' : undefined}>
                    Preview
                  </Label>
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
              <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                <FlexItem>4.19.2</FlexItem>
                <FlexItem>
                  <Label isCompact color={isCardSelected === id2 ? 'blue' : undefined}>
                    Latest
                  </Label>
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
              <Card className="pf-v6-u-mt-md" id="4.17-card" isSelectable isSelected={isCardSelected === id4}>
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
                    <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                      <FlexItem>4.17.34</FlexItem>
                      <FlexItem>
                        <Label isCompact color={isCardSelected === id4 ? 'blue' : undefined}>
                          Maintenance
                        </Label>
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
      <CardBody
        style={{ '--pf-v6-c-card--child--PaddingBlockEnd': 'var(--pf-t--global--spacer--md)' } as React.CSSProperties}
      >
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

const DownloadCard = () => (
  <Card>
    <CardHeader isToggleRightAligned>
      <CardTitle>
        <Flex spaceItems={{ default: 'spaceItemsSm' }}>
          <FlexItem>
            <Icon size="lg" status="success">
              <CheckCircleIcon />
            </Icon>
          </FlexItem>
          <FlexItem>Your discovery ISO is ready</FlexItem>
        </Flex>
      </CardTitle>
    </CardHeader>
    <CardBody>
      <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsLg' }}>
        <FlexItem>
          <Content component={ContentVariants.p}>
            To begin adding hosts to your bare metal cluster, you first need to boot them with the generated Discovery
            ISO. This allows the installation program to see and manage your hardware.
          </Content>
        </FlexItem>

        <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
          <FlexItem>
            <Button variant={ButtonVariant.primary} icon={<ArrowCircleDownIcon />} isBlock>
              Download Discovery ISO
            </Button>
          </FlexItem>

          <FlexItem alignSelf={{ default: 'alignSelfCenter' }}>
            <Content component={ContentVariants.small}>1.2 GB • Expires in 24 hours</Content>
          </FlexItem>
        </Flex>
      </Flex>
    </CardBody>
    <CardFooter>
      <Content component={ContentVariants.small}>
        <strong>Next step:</strong> After downloading, boot your bare metal hosts from this ISO image.
      </Content>
    </CardFooter>
  </Card>
);

export const UserMessageWithExtraContent: FunctionComponent = () => (
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
    <Message
      avatar={patternflyAvatar}
      name="Bot"
      role="bot"
      content="This is a message with a live progress summmary card."
      timestamp="1 hour ago"
      extraContent={{
        afterMainContent: <LiveProgressSummaryCard />
      }}
    />
    <Message
      avatar={patternflyAvatar}
      name="Bot"
      role="bot"
      content="This is a message with a version selector card."
      timestamp="1 hour ago"
      extraContent={{
        afterMainContent: <VersionSelectorCard />
      }}
    />
    <Message
      avatar={patternflyAvatar}
      name="Bot"
      role="bot"
      content="All set! I've finished building the Discovery ISO. The next step is to download it and boot your hosts, which you can do using the summary card I've prepared for you:"
      extraContent={{
        endContent: <DownloadCard />
      }}
    />
  </>
);
