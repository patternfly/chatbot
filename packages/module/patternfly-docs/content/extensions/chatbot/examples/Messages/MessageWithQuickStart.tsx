import { FunctionComponent } from 'react';
import Message from '@patternfly/chatbot/dist/dynamic/Message';
import { explorePipelinesQuickStart } from './explore-pipeline-quickstart.ts';
import { monitorSampleAppQuickStart } from '@patternfly/chatbot/src/Message/QuickStarts/monitor-sampleapp-quickstart.ts';
import { QuickStart } from '@patternfly/chatbot/dist/esm/Message/QuickStarts/types';

export const MessageWithQuickStartExample: FunctionComponent = () => (
  <>
    <Message
      name="Bot"
      role="bot"
      content="Follow this quick guide to install the Pipelines Operator."
      quickStarts={{
        quickStart: explorePipelinesQuickStart as QuickStart,
        onSelectQuickStart: (id) => alert(id)
      }}
    />
    <Message
      name="Bot"
      role="bot"
      content="This quick start tile includes prerequisites and a default icon."
      quickStarts={{
        quickStart: monitorSampleAppQuickStart,
        onSelectQuickStart: (id) => alert(id)
      }}
    />
    <Message
      name="Bot"
      role="bot"
      content="This quick start tile is compact"
      quickStarts={{
        quickStart: monitorSampleAppQuickStart,
        onSelectQuickStart: (id) => alert(id)
      }}
      isCompact
    />
  </>
);
