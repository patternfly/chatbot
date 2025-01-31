import React from 'react';
import Message from '@patternfly/chatbot/dist/dynamic/Message';
import patternflyAvatar from './patternfly_avatar.jpg';
import { explorePipelinesQuickStart } from './explore-pipeline-quickstart.ts';
import { monitorSampleAppQuickStart } from '@patternfly/chatbot/src/Message/QuickStarts/monitor-sampleapp-quickstart.ts';
import { QuickStart } from '@patternfly/chatbot/dist/esm/Message/QuickStarts/types';

export const MessageWithQuickStartExample: React.FunctionComponent = () => (
  <>
    <Message
      name="Bot"
      role="bot"
      avatar={patternflyAvatar}
      content="Follow this quick guide to install the Pipelines Operator."
      quickStarts={{
        quickStart: explorePipelinesQuickStart as QuickStart,
        onSelectQuickStart: (id) => alert(id)
      }}
    />
    <Message
      name="Bot"
      role="bot"
      avatar={patternflyAvatar}
      content="This quick start tile includes prerequisites and a default icon."
      quickStarts={{
        quickStart: monitorSampleAppQuickStart,
        onSelectQuickStart: (id) => alert(id)
      }}
    />
  </>
);
