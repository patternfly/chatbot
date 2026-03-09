import { Skeleton, SkeletonProps } from '@patternfly/react-core';
import type { FunctionComponent } from 'react';

export const LoadingState: FunctionComponent<SkeletonProps> = ({ screenreaderText, ...rest }: SkeletonProps) => (
  <div className="pf-chatbot__history-loading">
    <div className="pf-chatbot__history-loading-block">
      <Skeleton screenreaderText={screenreaderText ?? 'Loading chatbot chat history'} fontSize="3xl" {...rest} />
    </div>
    <div className="pf-chatbot__history-loading-block">
      <Skeleton fontSize="sm" width="70%" {...rest} />
      <Skeleton fontSize="3xl" {...rest} />
      <Skeleton fontSize="3xl" {...rest} />
    </div>
    <div className="pf-chatbot__history-loading-block">
      <Skeleton fontSize="sm" width="70%" {...rest} />
      <Skeleton fontSize="3xl" {...rest} />
      <Skeleton fontSize="3xl" {...rest} />
      <Skeleton fontSize="3xl" {...rest} />
    </div>
    <div className="pf-chatbot__history-loading-block">
      <Skeleton fontSize="sm" width="70%" {...rest} />
      <Skeleton fontSize="3xl" {...rest} />
      <Skeleton fontSize="3xl" {...rest} />
      <Skeleton fontSize="3xl" {...rest} />
      <Skeleton fontSize="3xl" {...rest} />
    </div>
    <div className="pf-chatbot__history-loading-block">
      <Skeleton fontSize="sm" width="70%" {...rest} />
      <Skeleton fontSize="3xl" {...rest} />
    </div>
  </div>
);

export default LoadingState;
