import { FunctionComponent, MouseEvent as ReactMouseEvent, KeyboardEvent as ReactKeyboardEvent } from 'react';
import Message from '@patternfly/chatbot/dist/dynamic/Message';
import patternflyAvatar from './patternfly_avatar.jpg';
import { CopyIcon, WrenchIcon } from '@patternfly/react-icons';
import {
  Button,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Flex,
  FlexItem,
  Label
} from '@patternfly/react-core';

export const MessageWithToolResponseExample: FunctionComponent = () => (
  <Message
    name="Bot"
    role="bot"
    avatar={patternflyAvatar}
    content="This example has a body description that's within the recommended limit of 2 lines:"
    toolResponse={{
      collapsedToggleText: 'Tool response: Name',
      expandedToggleText: 'Tool response: Name',
      subheading: 'Thought for 3 seconds',
      body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      cardTitle: (
        <Flex alignItems={{ default: 'alignItemsCenter' }} justifyContent={{ default: 'justifyContentSpaceBetween' }}>
          <FlexItem>
            <Flex direction={{ default: 'column' }}>
              <FlexItem>
                <Flex>
                  <FlexItem>
                    <WrenchIcon />
                  </FlexItem>
                  <FlexItem>Tool name</FlexItem>
                </Flex>
              </FlexItem>
              <FlexItem>Execution time: 0.12s</FlexItem>
            </Flex>
          </FlexItem>
          <FlexItem>
            <Button variant="plain" aria-label="Copy to clipboard" icon={<CopyIcon />}></Button>
          </FlexItem>
        </Flex>
      ),
      cardBody: (
        <DescriptionList aria-label="Basic example">
          <DescriptionListGroup>
            <DescriptionListTerm>Parameters</DescriptionListTerm>
            <DescriptionListDescription>
              <Flex direction={{ default: 'column' }}>
                <FlexItem>Optional description text goes here</FlexItem>
                <FlexItem>
                  <Label>type</Label>
                </FlexItem>
              </Flex>
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Response</DescriptionListTerm>
            <DescriptionListDescription>
              <a href="#">mary-test</a>
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      )
    }}
  />
);
