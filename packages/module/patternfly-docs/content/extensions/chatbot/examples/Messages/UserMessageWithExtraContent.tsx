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
  CardTitle,
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
  ExpandableSection,
  ExpandableSectionToggle
} from '@patternfly/react-core';
import { ArrowRightIcon } from '@patternfly/react-icons';

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
  const [expanded, setExpanded] = useState('def-list-toggle2');
  const [isExpanded, setIsExpanded] = useState(false);

  const onToggle = (id: string) => {
    if (id === expanded) {
      setExpanded('');
    } else {
      setExpanded(id);
    }
  };

  const onExpand = (isExpanded: boolean) => {
    setIsExpanded(isExpanded);
  };

  const contentId = 'detached-expandable-section-content';
  const toggleId = 'detached-expandable-section-toggle';

  const CardInformationAfterMainContent = () => (
    <Card ouiaId="BasicCard">
      <CardBody>
        <DescriptionList>
          <DescriptionListGroup>
            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
              <FlexItem>
                <DescriptionListTerm id="title-outside-progress-example-label">
                  OpenShift cluster installation
                </DescriptionListTerm>
              </FlexItem>
              <FlexItem>
                <ExpandableSectionToggle
                  isExpanded={isExpanded}
                  onToggle={onExpand}
                  toggleId={toggleId}
                  contentId={contentId}
                  direction="down"
                  aria-label="Expand additional progress info"
                ></ExpandableSectionToggle>
              </FlexItem>
            </Flex>
            <DescriptionListDescription>
              <Progress
                aria-labelledby="title-outside-progress-example-label"
                value={50}
                measureLocation={ProgressMeasureLocation.outside}
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

        <ExpandableSection isExpanded={isExpanded} isDetached toggleId={toggleId} contentId={contentId}>
          <Accordion asDefinitionList>
            <hr style={{ marginBlockEnd: '20px', marginBlockStart: '20px' }} />
            <AccordionItem isExpanded={expanded === 'def-list-toggle1'}>
              <AccordionToggle
                onClick={() => {
                  onToggle('def-list-toggle1');
                }}
                id="def-list-toggle1"
              >
                Installing cluster bootstrap
              </AccordionToggle>
              <AccordionContent id="def-list-expand1">
                <p>
                  Vivamus et tortor sed arcu congue vehicula eget et diam. Praesent nec dictum lorem. Aliquam id diam
                  ultrices, faucibus erat id, maximus nunc.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem isExpanded={expanded === 'def-list-toggle2'}>
              <AccordionToggle
                onClick={() => {
                  onToggle('def-list-toggle2');
                }}
                id="def-list-toggle2"
              >
                Control plane setup
              </AccordionToggle>
              <AccordionContent id="def-list-expand2">
                <p>
                  Vivamus et tortor sed arcu congue vehicula eget et diam. Praesent nec dictum lorem. Aliquam id diam
                  ultrices, faucibus erat id, maximus nunc.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem isExpanded={expanded === 'def-list-toggle3'}>
              <AccordionToggle
                onClick={() => {
                  onToggle('def-list-toggle3');
                }}
                id="def-list-toggle3"
              >
                Deploying cluster operators
              </AccordionToggle>
              <AccordionContent id="def-list-expand3">
                <p>Morbi vitae urna quis nunc convallis hendrerit. Aliquam congue orci quis ultricies tempus.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem isExpanded={expanded === 'def-list-toggle4'}>
              <AccordionToggle
                onClick={() => {
                  onToggle('def-list-toggle4');
                }}
                id="def-list-toggle4"
              >
                Finalizing installation
              </AccordionToggle>
              <AccordionContent id="def-list-expand4">
                <p>
                  Donec vel posuere orci. Phasellus quis tortor a ex hendrerit efficitur. Aliquam lacinia ligula
                  pharetra, sagittis ex ut, pellentesque diam. Vestibulum ante ipsum primis in faucibus orci luctus et
                  ultrices posuere cubilia Curae; Vestibulum ultricies nulla nibh. Etiam vel dui fermentum ligula
                  ullamcorper eleifend non quis tortor. Morbi tempus ornare tempus. Orci varius natoque penatibus et
                  magnis dis parturient montes, nascetur ridiculus mus. Mauris et velit neque. Donec ultricies
                  condimentum mauris, pellentesque imperdiet libero convallis convallis. Aliquam erat volutpat. Donec
                  rutrum semper tempus. Proin dictum imperdiet nibh, quis dapibus nulla. Integer sed tincidunt lectus,
                  sit amet auctor eros.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ExpandableSection>
      </CardBody>
      <CardFooter>
        <Button isBlock variant="secondary" icon={<ArrowRightIcon />} iconPosition="end">
          Open in console
        </Button>
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
