import React, { FunctionComponent } from 'react';
import Message from '@patternfly/chatbot/dist/dynamic/Message';
import {
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
  Icon,
  Stack,
  StackItem
} from '@patternfly/react-core';
import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import ArrowCircleDownIcon from '@patternfly/react-icons/dist/esm/icons/arrow-circle-down-icon';
import patternflyAvatar from '../Messages/patternfly_avatar.jpg';

export const ISODownloadCardExample: FunctionComponent = () => {
  const downloadCard = (
    <Card>
      <CardHeader>
        <CardTitle>
          <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
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
        <Stack hasGutter>
          <StackItem>
            <Content component={ContentVariants.p}>
              To begin adding hosts to your bare metal cluster, you first need to boot them with the generated Discovery
              ISO. This allows the installation program to see and manage your hardware.
            </Content>
          </StackItem>

          <StackItem>
            <Button variant={ButtonVariant.primary} icon={<ArrowCircleDownIcon />} isBlock>
              Download Discovery ISO
            </Button>
          </StackItem>

          <StackItem style={{ textAlign: 'center' }}>
            <Content component={ContentVariants.small}>1.2 GB • Expires in 24 hours</Content>
          </StackItem>
        </Stack>
      </CardBody>

      <CardFooter>
        <Content component={ContentVariants.small}>
          <strong>Next step:</strong> After downloading, boot your bare metal hosts from this ISO image.
        </Content>
      </CardFooter>
    </Card>
  );

  return (
    <Message
      name="Bot"
      role="bot"
      avatar={patternflyAvatar}
      content="All set! I've finished building the Discovery ISO. The next step is to download it and boot your hosts, which you can do using the summary card I've prepared for you below"
      extraContent={{
        endContent: downloadCard
      }}
    />
  );
};
