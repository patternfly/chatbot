import { useState, FunctionComponent, MouseEvent as ReactMouseEvent } from 'react';
import Message from '@patternfly/chatbot/dist/dynamic/Message';
import patternflyAvatar from './patternfly_avatar.jpg';
import { CopyIcon, WrenchIcon } from '@patternfly/react-icons';
import {
  Button,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  ExpandableSection,
  ExpandableSectionVariant,
  Flex,
  FlexItem,
  Label
} from '@patternfly/react-core';

export const MessageWithToolResponseExample: FunctionComponent = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const onToggle = (_event: ReactMouseEvent, isExpanded: boolean) => {
    setIsExpanded(isExpanded);
  };

  return (
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
              <Flex direction={{ default: 'column' }} gap={{ default: 'gapXs' }}>
                <FlexItem grow={{ default: 'grow' }}>
                  <Flex gap={{ default: 'gapXs' }}>
                    <FlexItem>
                      <WrenchIcon style={{ color: 'var(--pf-t--global--icon--color--brand--default' }} />
                    </FlexItem>
                    <FlexItem>Tool name</FlexItem>
                  </Flex>
                </FlexItem>
                <FlexItem>
                  <Flex gap={{ default: 'gapSm' }} style={{ fontSize: '12px', fontWeight: '400' }}>
                    <FlexItem>Execution time:</FlexItem>
                    <FlexItem>0.12s</FlexItem>
                  </Flex>
                </FlexItem>
              </Flex>
            </FlexItem>
            <FlexItem>
              <Button
                variant="plain"
                aria-label="Copy tool response to clipboard"
                icon={<CopyIcon style={{ color: 'var(--pf-t--global--icon--color--subtle)' }} />}
              ></Button>
            </FlexItem>
          </Flex>
        ),
        cardBody: (
          <>
            <DescriptionList
              style={{ '--pf-v6-c-description-list--RowGap': 'var(--pf-t--global--spacer--md)' } as any}
              aria-label="Tool response"
            >
              <DescriptionListGroup
                style={{ '--pf-v6-c-description-list__group--RowGap': 'var(--pf-t--global--spacer--xs)' } as any}
              >
                <DescriptionListTerm>Parameters</DescriptionListTerm>
                <DescriptionListDescription>
                  <Flex direction={{ default: 'column' }}>
                    <FlexItem>Optional description text goes here</FlexItem>
                    <FlexItem>
                      <Flex gap={{ default: 'gapSm' }}>
                        <FlexItem>
                          <Label variant="outline" color="blue">
                            type
                          </Label>
                        </FlexItem>
                        <FlexItem>
                          <Label variant="outline" color="blue">
                            properties
                          </Label>
                        </FlexItem>
                        <FlexItem>
                          <Label variant="outline" color="blue">
                            label
                          </Label>
                        </FlexItem>
                        <FlexItem>
                          <Label variant="outline" color="blue">
                            label
                          </Label>
                        </FlexItem>
                      </Flex>
                    </FlexItem>
                  </Flex>
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup
                style={{ '--pf-v6-c-description-list__group--RowGap': 'var(--pf-t--global--spacer--xs)' } as any}
              >
                <DescriptionListTerm>Response</DescriptionListTerm>
                <DescriptionListDescription>
                  <ExpandableSection
                    variant={ExpandableSectionVariant.truncate}
                    toggleText={isExpanded ? 'show less' : 'show more'}
                    onToggle={onToggle}
                    isExpanded={isExpanded}
                    style={
                      {
                        '--pf-v6-c-expandable-section__content--Opacity': '1',
                        '--pf-v6-c-expandable-section__content--PaddingInlineStart': 0,
                        '--pf-v6-c-expandable-section__content--TranslateY': 0,
                        '--pf-v6-c-expandable-section--m-expand-top__content--TranslateY': 0
                      } as any
                    }
                  >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nec dignissim turpis, et tristique
                    purus. Phasellus efficitur ante quis dolor viverra imperdiet. Orci varius natoque penatibus et
                    magnis dis parturient montes, nascetur ridiculus mus. Pellentesque laoreet, sem ac elementum semper,
                    lectus mauris vestibulum nulla, eget volutpat massa neque vel turpis. Donec finibus enim eu leo
                    accumsan consectetur. Praesent massa diam, tincidunt eu dui ac, ullamcorper elementum est. Phasellus
                    metus felis, venenatis vitae semper nec, porta a metus. Vestibulum justo nisi, imperdiet id eleifend
                    at, varius nec lorem. Fusce porttitor mollis nibh, ut elementum ante commodo tincidunt. Integer
                    tincidunt at ipsum non aliquet.
                  </ExpandableSection>
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </>
        )
      }}
    />
  );
};
