import { Fragment, FunctionComponent, useState, useEffect } from 'react';
import Message from '@patternfly/chatbot/dist/dynamic/Message';
import userAvatar from './user_avatar.svg';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionToggle,
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CodeBlock,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  HelperText,
  HelperTextItem,
  Progress,
  ProgressMeasureLocation,
  Flex,
  FlexItem,
  CardTitle,
  CardHeader,
  CardExpandableContent,
  Spinner,
  CodeBlockCode
} from '@patternfly/react-core';
import { ArrowRightIcon, CheckCircleIcon } from '@patternfly/react-icons';

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
    return `About ${estimatedMinutes} minute${estimatedMinutes !== 1 ? 's' : ''} left`;
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
          '--pf-v6-c-code-block--BackgroundColor': 'var(--pf-t--color--gray--95)'
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
      <Card ouiaId="BasicCard" isExpanded={isCardExpanded}>
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
                          <HelperTextItem>{progress >= 100 ? 'Completed' : getTimeRemaining()}</HelperTextItem>
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
            <hr className="pf-v6-u-mb-md" />
            <Accordion
              style={
                {
                  '--pf-v6-c-accordion__expandable-content-body--PaddingBlockStart': '0',
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
                  <AccordionContent id={stage.id.replace('-toggle', '')}>{renderCodeBlock(stage)}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardBody>
        </CardExpandableContent>
        <CardFooter>
          <Button isBlock variant="secondary" icon={<ArrowRightIcon />} iconPosition="end">
            Open in console
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

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
      avatar={userAvatar}
      name="User"
      role="user"
      content="This is a main message."
      timestamp="1 hour ago"
      extraContent={{
        afterMainContent: <LiveProgressSummaryCard />
      }}
    />
  </>
);
