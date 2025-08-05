import { Fragment, FunctionComponent, useState } from 'react';
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
import React from 'react';

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

const CardInformationAfterMainContent = () => (
  <Card ouiaId="BasicCard">
    <CardTitle>This is content card after main content</CardTitle>
    <CardBody>Body</CardBody>
    <CardFooter>Footer</CardFooter>
  </Card>
);

const LiveProgressSummaryCard = () => {
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [isAccordionExpanded, setIsAccordionExpanded] = useState('deploying-toggle');

  const onExpandCard = (_event: React.MouseEvent) => {
    setIsCardExpanded(!isCardExpanded);
  };

  const onExpandAccordion = (id: string) => {
    if (id === isAccordionExpanded) {
      setIsAccordionExpanded('');
    } else {
      setIsAccordionExpanded(id);
    }
  };

  const renderCodeBlock = (initialWord: string) => (
    <CodeBlock
      style={
        {
          '--pf-v6-c-code-block--BackgroundColor': 'var(--pf-t--color--gray--95)'
        } as React.CSSProperties
      }
    >
      <CodeBlockCode>
        {`${initialWord} openshift-apiserver operator...
${initialWord} openshift-sdn operator...
${initialWord} openshift-ingress operator...`}
      </CodeBlockCode>
    </CodeBlock>
  );

  return (
    // eslint-disable-next-line no-console
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
          <DescriptionListGroup style={{ '--pf-v6-c-description-list__group--RowGap': '1rem' } as React.CSSProperties}>
            <DescriptionListTerm id="title-outside-progress-example-label">
              OpenShift cluster installation
            </DescriptionListTerm>
            <DescriptionListDescription>
              <Progress
                aria-labelledby="title-outside-progress-example-label"
                value={50}
                measureLocation={ProgressMeasureLocation.outside}
                style={{ '--pf-v6-c-progress--GridGap': '0.5rem' } as React.CSSProperties}
                helperText={
                  <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                    <FlexItem>
                      <HelperText>
                        <HelperTextItem>Deploying cluster operators</HelperTextItem>
                      </HelperText>
                    </FlexItem>
                    <FlexItem>
                      <HelperText>
                        <HelperTextItem>About 23 minutes left</HelperTextItem>
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
          <hr style={{ marginBlockEnd: '1rem' }} />
          <Accordion>
            <AccordionItem isExpanded={isAccordionExpanded === 'installing-toggle'}>
              <AccordionToggle
                onClick={() => {
                  onExpandAccordion('installing-toggle');
                }}
                id="installing-toggle"
              >
                <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                  <FlexItem>
                    <CheckCircleIcon color="green" aria-label="Complete" />
                  </FlexItem>
                  <FlexItem>Installing cluster bootstrap</FlexItem>
                </Flex>
              </AccordionToggle>
              <AccordionContent
                id="installing"
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
                {renderCodeBlock('Installing')}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem isExpanded={isAccordionExpanded === 'setup-toggle'}>
              <AccordionToggle
                onClick={() => {
                  onExpandAccordion('setup-toggle');
                }}
                id="setup-toggle"
              >
                <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                  <FlexItem>
                    <CheckCircleIcon color="green" aria-label="Complete" />
                  </FlexItem>
                  <FlexItem>Control plane setup</FlexItem>
                </Flex>
              </AccordionToggle>
              <AccordionContent
                id="setup"
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
                {renderCodeBlock('Setting up')}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem isExpanded={isAccordionExpanded === 'deploying-toggle'}>
              <AccordionToggle
                onClick={() => {
                  onExpandAccordion('deploying-toggle');
                }}
                id="deploying-toggle"
              >
                <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                  <FlexItem>
                    <Spinner size="sm" aria-valuetext="In progress" />
                  </FlexItem>
                  <FlexItem>Deploying cluster operators</FlexItem>
                </Flex>
              </AccordionToggle>
              <AccordionContent
                id="deploying"
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
                {renderCodeBlock('Deploying')}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem isExpanded={isAccordionExpanded === 'finalizing-toggle'}>
              <AccordionToggle
                onClick={() => {
                  onExpandAccordion('finalizing-toggle');
                }}
                id="finalizing-toggle"
              >
                <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
                  <FlexItem style={{ width: '1rem' }}>{/* Empty space to maintain consistent alignment */}</FlexItem>
                  <FlexItem>Finalizing installation</FlexItem>
                </Flex>
              </AccordionToggle>
              <AccordionContent
                id="finalizing"
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
                {renderCodeBlock('Finalizing')}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardBody>
      </CardExpandableContent>
      <CardFooter>
        <Button isBlock variant="secondary" icon={<ArrowRightIcon />} iconPosition="end">
          Open in console
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
