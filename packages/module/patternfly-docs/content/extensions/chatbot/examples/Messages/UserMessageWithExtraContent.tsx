import { Fragment, FunctionComponent } from 'react';

import Message from '@patternfly/chatbot/dist/dynamic/Message';
import userAvatar from './user_avatar.svg';
import {
  Alert,
  Badge,
  Button,
  ButtonVariant,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Content,
  ContentVariants,
  Flex,
  FlexItem,
  Icon
} from '@patternfly/react-core';
import ArrowCircleDownIcon from '@patternfly/react-icons/dist/esm/icons/arrow-circle-down-icon';
import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import patternflyAvatar from '../Messages/patternfly_avatar.jpg';

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

const downloadCard = (
  <Card>
    <CardHeader>
      <CardTitle>
        <Icon size="lg" status="success">
          <CheckCircleIcon />
        </Icon>
        Your discovery ISO is ready
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
      content="All set! I've finished building the Discovery ISO. The next step is to download it and boot your hosts, which you can do using the summary card I've prepared for you:"
      extraContent={{
        endContent: downloadCard
      }}
    />
  </>
);
