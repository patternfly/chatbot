import type { FunctionComponent } from 'react';
import { useState } from 'react';
import { Label, LabelGroup, LabelGroupProps, LabelProps } from '@patternfly/react-core';
import { CheckIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';

export interface QuickResponse extends Omit<LabelProps, 'children'> {
  content: string;
  id: string;
  onClick?: () => void;
}

export interface QuickResponseProps {
  /** Props for quick responses */
  quickResponses: QuickResponse[];
  /** Props for quick responses container */
  quickResponseContainerProps?: Omit<LabelGroupProps, 'ref'>;
  /** Callback when a response is clicked; used in feedback cards */
  onSelect?: (id: string) => void;
  /** Sets the quick responses to compact styling */
  isCompact?: boolean;
}

export const QuickResponse: FunctionComponent<QuickResponseProps> = ({
  quickResponses,
  quickResponseContainerProps = { numLabels: 5 },
  onSelect,
  isCompact
}: QuickResponseProps) => {
  const [selectedQuickResponse, setSelectedQuickResponse] = useState<string>();

  const handleQuickResponseClick = (id: string, onClick?: () => void) => {
    setSelectedQuickResponse(id);
    onClick && onClick();
    onSelect && onSelect(id);
  };
  return (
    <LabelGroup
      className={css('pf-chatbot__message-quick-response', quickResponseContainerProps?.className)}
      {...quickResponseContainerProps}
    >
      {quickResponses.map(({ id, onClick, content, className, ...props }: QuickResponse) => (
        <Label
          variant={id === selectedQuickResponse ? undefined : 'outline'}
          icon={id === selectedQuickResponse ? <CheckIcon /> : undefined}
          color="blue"
          key={id}
          onClick={() => handleQuickResponseClick(id, onClick)}
          className={css(id === selectedQuickResponse && 'pf-chatbot__message-quick-response--selected', className)}
          isCompact={isCompact}
          {...props}
        >
          {content}
        </Label>
      ))}
    </LabelGroup>
  );
};

export default QuickResponse;
