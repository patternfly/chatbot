import React from 'react';

import Message from '@patternfly/chatbot/dist/dynamic/Message';
import userAvatar from './user_avatar.svg';
import { Alert, Badge, Button, Card, CardBody, CardFooter, CardTitle } from '@patternfly/react-core';

const UserActionEndContent = () => {
  // eslint-disable-next-line no-console
  const onClick = () => console.log('custom button click');
  return (
    <React.Fragment>
      <Button variant="secondary" ouiaId="Secondary" onClick={onClick}>
        End content button
      </Button>
      <Alert variant="danger" title="Danger alert title" ouiaId="DangerAlert" />
    </React.Fragment>
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

export const UserMessageWithExtraContent: React.FunctionComponent = () => (
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
