import { FunctionComponent, MouseEvent as ReactMouseEvent, KeyboardEvent as ReactKeyboardEvent, useState } from 'react';
import Message from '@patternfly/chatbot/dist/dynamic/Message';
import patternflyAvatar from './patternfly_avatar.jpg';
import { Button, Checkbox, Flex, FlexItem, Label, Popover } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';

export const MessageWithSourcesExample: FunctionComponent = () => {
  const onSetPage = (_event: ReactMouseEvent | ReactKeyboardEvent | MouseEvent, newPage: number) => {
    // eslint-disable-next-line no-console
    console.log(`Page changed to ${newPage}`);
  };

  const date = new Date();

  const datePart = date.toLocaleDateString('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const timePart = date.toLocaleTimeString('en', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const formattedDate = `${datePart}, ${timePart}`;

  return (
    <>
      <Message
        name="Bot"
        role="bot"
        avatar={patternflyAvatar}
        content="This example has a custom subtitle and footer with no pagination"
        sources={{
          sources: [
            {
              title: 'Getting started with Red Hat OpenShift',
              subtitle: 'Red Hat knowledge base',
              link: '#',
              body: 'Red Hat OpenShift on IBM Cloud is a managed offering to create your own cluster of compute hosts where you can deploy and manage containerized apps on IBM Cloud ...',
              isExternal: true,
              footer: (
                <Flex className="pf-chatbot__sources-card-subtle" gap={{ default: 'gapXs' }}>
                  <FlexItem alignSelf={{ default: 'alignSelfStretch' }}>
                    <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                      <FlexItem>
                        <Label color="green">Confidence 93%</Label>
                      </FlexItem>
                      <FlexItem>
                        <Popover
                          headerContent={
                            <Flex gap={{ default: 'gapXs' }}>
                              <FlexItem>
                                <OutlinedQuestionCircleIcon />
                              </FlexItem>
                              <FlexItem>Why this confidence score?</FlexItem>
                            </Flex>
                          }
                          bodyContent={
                            <>
                              A high confidence score indicates a strong match. The system found significant overlap in
                              key data points, including text content, names, dates, and organizational details, with a
                              high degree of certainty. This match is highly reliable.
                            </>
                          }
                        >
                          <Button variant="link" icon={<OutlinedQuestionCircleIcon />}>
                            Learn about this score
                          </Button>
                        </Popover>
                      </FlexItem>
                    </Flex>
                  </FlexItem>
                  <FlexItem>{`Last updated: ${formattedDate}`}</FlexItem>
                </Flex>
              )
            }
          ]
        }}
      />
      <Message
        name="Bot"
        role="bot"
        avatar={patternflyAvatar}
        content="This example has a body description that's within the recommended limit of 2 lines:"
        sources={{
          sources: [
            {
              title: 'Getting started with Red Hat OpenShift',
              link: '#',
              body: 'Red Hat OpenShift on IBM Cloud is a managed offering to create your own cluster of compute hosts where you can deploy and manage containerized apps on IBM Cloud ...',
              isExternal: true
            },
            {
              title: 'Azure Red Hat OpenShift documentation',
              link: '#',
              body: 'Microsoft Azure Red Hat OpenShift allows you to deploy a production ready Red Hat OpenShift cluster in Azure ...',
              isExternal: true
            },
            {
              title: 'OKD Documentation: Home',
              link: '#',
              body: 'OKD is a distribution of Kubernetes optimized for continuous application development and multi-tenant deployment. OKD also serves as the upstream code base upon ...',
              isExternal: true
            }
          ],
          onSetPage
        }}
      />
      <Message
        name="Bot"
        role="bot"
        avatar={patternflyAvatar}
        content="This example has a body description that's longer than the recommended limit of 2 lines, with a link to load the rest of the description:"
        sources={{
          sources: [
            {
              title: 'Getting started with Red Hat OpenShift',
              link: '#',
              body: 'Red Hat OpenShift on IBM Cloud is a managed offering to create your own cluster of compute hosts where you can deploy and manage containerized apps on IBM Cloud.',
              hasShowMore: true
            },
            {
              title: 'Azure Red Hat OpenShift documentation',
              link: '#',
              body: 'Microsoft Azure Red Hat OpenShift allows you to deploy a production ready Red Hat OpenShift cluster in Azure.',
              hasShowMore: true
            },
            {
              title: 'OKD Documentation: Home',
              link: '#',
              body: 'OKD is a distribution of Kubernetes optimized for continuous application development and multi-tenant deployment. OKD also serves as the upstream code base upon.',
              hasShowMore: true
            }
          ],
          onSetPage
        }}
      />
      <Message
        name="Bot"
        role="bot"
        avatar={patternflyAvatar}
        content="This example has a truncated title:"
        sources={{
          sources: [
            {
              title: 'Getting started with Red Hat OpenShift AI and other products',
              link: '#',
              body: 'Red Hat OpenShift on IBM Cloud is a managed offering to create your own cluster of compute hosts where you can deploy and manage containerized apps on IBM Cloud ...',
              isExternal: true
            },
            {
              title: 'Azure Red Hat OpenShift documentation | Red Hat',
              link: '#',
              body: 'Microsoft Azure Red Hat OpenShift allows you to deploy a production ready Red Hat OpenShift cluster in Azure ...',
              isExternal: true
            }
          ],
          onSetPage
        }}
      />
      <Message
        name="Bot"
        role="bot"
        avatar={patternflyAvatar}
        content="This example only includes 1 source:"
        sources={{
          sources: [
            {
              title: 'Getting started with Red Hat OpenShift',
              link: '#',
              body: 'Red Hat OpenShift on IBM Cloud is a managed offering to create your own cluster of compute hosts where you can deploy and manage containerized apps on IBM Cloud ...',
              isExternal: true
            }
          ],
          onSetPage
        }}
      />
      <Message
        name="Bot"
        role="bot"
        avatar={patternflyAvatar}
        content="This example has a title and no body description:"
        sources={{
          sources: [
            { title: 'Getting started with Red Hat OpenShift', link: '#', isExternal: true },
            {
              title: 'Azure Red Hat OpenShift documentation',
              link: '#',
              isExternal: true
            },
            {
              title: 'OKD Documentation: Home',
              link: '#',
              isExternal: true
            }
          ],
          onSetPage
        }}
      />
      <Message
        name="Bot"
        role="bot"
        avatar={patternflyAvatar}
        content="This example displays the source as a link, without a title (not recommended)"
        sources={{
          sources: [
            {
              link: '#'
            },
            {
              link: '#'
            },
            {
              link: '#'
            }
          ],
          onSetPage
        }}
      />
      <Message
        name="Bot"
        role="bot"
        avatar={patternflyAvatar}
        content="This example displays a compact sources card"
        sources={{
          sources: [
            {
              link: '#'
            },
            {
              link: '#'
            },
            {
              link: '#'
            }
          ],
          onSetPage
        }}
        isCompact
      />

      <Message
        name="Bot"
        role="bot"
        avatar={patternflyAvatar}
        content="This example demonstrates the non-paginated layout option. When enabled, all source cards are displayed in a flex layout that wraps automatically based on available space:"
        sources={{
          sources: [
            {
              title: 'Getting started with Red Hat OpenShift',
              link: '#',
              body: 'Red Hat OpenShift on IBM Cloud is a managed offering to create your own cluster of compute hosts where you can deploy and manage containerized apps on IBM Cloud ...',
              isExternal: true
            },
            {
              title: 'Azure Red Hat OpenShift documentation',
              link: '#',
              body: 'Microsoft Azure Red Hat OpenShift allows you to deploy a production ready Red Hat OpenShift cluster in Azure ...',
              isExternal: true
            },
            {
              title: 'OKD Documentation: Home',
              link: '#',
              body: 'OKD is a distribution of Kubernetes optimized for continuous application development and multi-tenant deployment. OKD also serves as the upstream code base upon ...',
              isExternal: true
            },
            {
              title: 'Red Hat OpenShift Container Platform',
              link: '#',
              body: 'Red Hat OpenShift Container Platform is a Kubernetes platform that provides a cloud-like experience anywhere it is deployed ...',
              isExternal: true
            }
          ],
          layout: 'wrap'
        }}
      />
    </>
  );
};
