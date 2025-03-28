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
        content="Example with sources"
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
        content="Example with very long sources"
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
        content="Example with only 1 source"
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
        content="Example with sources that include a title and link"
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
        content="Example with link-only sources (not recommended)"
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
    </>
  );
};
