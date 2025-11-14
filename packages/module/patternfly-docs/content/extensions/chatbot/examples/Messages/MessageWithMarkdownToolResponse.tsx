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
export const MessageWithToolResponseExample = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const onToggle = (_event: ReactMouseEvent, isExpanded: boolean) => {
    setIsExpanded(isExpanded);
  };
  const comprehensiveMarkdownBody = `Here's a comprehensive markdown example with various formatting options:

# h1 Heading

## h2 Heading

### h3 Heading

#### h4 Heading

##### h5 Heading

###### h6 Heading

## Text Emphasis

**Bold text, formatted with double asterisks**

__Bold text, formatted with double underscores__

*Italic text, formatted with single asterisks*

_Italic text, formatted with single underscores_

~~Strikethrough~~

## Inline Code

Here is an inline code example - \`() => void\`

## Code Blocks

Here is some YAML code:

~~~yaml
apiVersion: helm.openshift.io/v1beta1/
kind: HelmChartRepository
metadata:
  name: azure-sample-repo0oooo00ooo
spec:
  connectionConfig:
  url: https://raw.githubusercontent.com/Azure-Samples/helm-charts/master/docs
~~~

Here is some JavaScript code:

~~~js
const MessageLoading = () => (
  <div className="pf-chatbot__message-loading">
    <span className="pf-chatbot__message-loading-dots">
      <span className="pf-v6-screen-reader">Loading message</span>
    </span>
  </div>
);

export default MessageLoading;
~~~

## Block Quotes

> Blockquotes can also be nested...
>> ...by using additional greater-than signs (>) right next to each other...
> > > ...or with spaces between each sign.

## Lists

### Ordered List

1. Item 1
2. Item 2
3. Item 3

### Unordered List

* Item 1
* Item 2
* Item 3

### More Complex List

You may be wondering whether you can display more complex lists with formatting. In response to your question, I will explain how to spread butter on toast.

1. **Using a \`toaster\`:**

  - Place \`bread\` in a \`toaster\`
  - Once \`bread\` is lightly browned, remove from \`toaster\`

2. **Using a \`knife\`:**

  - Acquire 1 tablespoon of room temperature \`butter\`. Use \`knife\` to spread butter on \`toast\`. Bon appétit!

## Links

A paragraph with a URL: https://reactjs.org.

## Tables

To customize your table, you can use [PatternFly TableProps](/components/table#table)

| Version | GA date | User role 
|-|-|-|
| 2.5 | September 30, 2024 | Administrator |
| 2.5 | June 27, 2023 | Editor |
| 3.0 | April 1, 2025 | Administrator

## Images

![Multi-colored wavy lines on a black background](https://cdn.dribbble.com/userupload/10651749/file/original-8a07b8e39d9e8bf002358c66fce1223e.gif)

## Footnotes

This is some text that has a short footnote[^1] and this is text with a longer footnote.[^bignote]

[^1]: This is a short footnote. To return the highlight to the original message, click the arrow. 

[^bignote]: This is a long footnote with multiple paragraphs and formatting.

    To break long footnotes into paragraphs, indent the text. 

    Add as many paragraphs as you like. You can include *italic text*, **bold text**, and \`code\`.

    > You can even include blockquotes in footnotes!
`;
  return (
    <Message
      name="Bot"
      role="bot"
      avatar={patternflyAvatar}
      content="This example demonstrates a tool response with a comprehensive markdown body showing all formatting options:"
      toolResponse={{
        isToggleContentMarkdown: true,
        toggleContent: '# Tool response: toolName',
        isSubheadingMarkdown: true,
        subheading: '> Thought for 3 seconds',
        body: comprehensiveMarkdownBody,
        isBodyMarkdown: true,
        cardTitle: (
          <Flex
            alignItems={{
              default: 'alignItemsCenter'
            }}
            justifyContent={{
              default: 'justifyContentSpaceBetween'
            }}
          >
            <FlexItem>
              <Flex
                direction={{
                  default: 'column'
                }}
                gap={{
                  default: 'gapXs'
                }}
              >
                <FlexItem
                  grow={{
                    default: 'grow'
                  }}
                >
                  <Flex
                    gap={{
                      default: 'gapXs'
                    }}
                  >
                    <FlexItem>
                      <WrenchIcon
                        style={{
                          color: 'var(--pf-t--global--icon--color--brand--default'
                        }}
                      />
                    </FlexItem>
                    <FlexItem>toolName</FlexItem>
                  </Flex>
                </FlexItem>
                <FlexItem>
                  <Flex
                    gap={{
                      default: 'gapSm'
                    }}
                    style={{
                      fontSize: '12px',
                      fontWeight: '400'
                    }}
                  >
                    <FlexItem>Execution time:</FlexItem>
                    <FlexItem>0.12 seconds</FlexItem>
                  </Flex>
                </FlexItem>
              </Flex>
            </FlexItem>
            <FlexItem>
              <Button
                variant="plain"
                aria-label="Copy tool response to clipboard"
                icon={
                  <CopyIcon
                    style={{
                      color: 'var(--pf-t--global--icon--color--subtle)'
                    }}
                  />
                }
              ></Button>
            </FlexItem>
          </Flex>
        ),
        cardBody: (
          <>
            <DescriptionList
              style={{
                '--pf-v6-c-description-list--RowGap': 'var(--pf-t--global--spacer--md)'
              }}
              aria-label="Tool response"
            >
              <DescriptionListGroup
                style={{
                  '--pf-v6-c-description-list__group--RowGap': 'var(--pf-t--global--spacer--xs)'
                }}
              >
                <DescriptionListTerm>Parameters</DescriptionListTerm>
                <DescriptionListDescription>
                  <Flex
                    direction={{
                      default: 'column'
                    }}
                  >
                    <FlexItem>Optional description text for parameters.</FlexItem>
                    <FlexItem>
                      <Flex
                        gap={{
                          default: 'gapSm'
                        }}
                      >
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
                style={{
                  '--pf-v6-c-description-list__group--RowGap': 'var(--pf-t--global--spacer--xs)'
                }}
              >
                <DescriptionListTerm>Response</DescriptionListTerm>
                <DescriptionListDescription>
                  <ExpandableSection
                    variant={ExpandableSectionVariant.truncate}
                    toggleTextExpanded="show less of response"
                    toggleTextCollapsed="show more of response"
                    onToggle={onToggle}
                    isExpanded={isExpanded}
                    style={{
                      '--pf-v6-c-expandable-section__content--Opacity': '1',
                      '--pf-v6-c-expandable-section__content--PaddingInlineStart': 0,
                      '--pf-v6-c-expandable-section__content--TranslateY': 0,
                      '--pf-v6-c-expandable-section--m-expand-top__content--TranslateY': 0
                    }}
                  >
                    Descriptive text about the tool response, including completion status, details on the data that was
                    processed, or anything else relevant to the use case.
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
