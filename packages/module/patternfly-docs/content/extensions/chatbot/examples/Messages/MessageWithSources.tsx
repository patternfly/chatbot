import React from 'react';
import Message from '@patternfly/chatbot/dist/dynamic/Message';
import patternflyAvatar from './patternfly_avatar.jpg';

export const MessageWithSourcesExample: React.FunctionComponent = () => {
  const onSetPage = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPage: number) => {
    // eslint-disable-next-line no-console
    console.log(`Page changed to ${newPage}`);
  };

  return (
    <>
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
    </>
  );
};
