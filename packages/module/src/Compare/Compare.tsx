import React, { PropsWithChildren } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@patternfly/react-core';

interface CompareProps {
  /** First of two children to render */
  firstChild: React.ReactNode;
  /** Second of two children to render */
  secondChild: React.ReactNode;
  /** Display name for first child, used in mobile toggle */
  firstChildDisplayName: string;
  /** Display name for second child, used in mobile toggle */
  secondChildDisplayName: string;
  /** Aria label for mobile toggle group */
  toggleGroupAriaLabel?: string;
  /** Callback for when mobile toggle is used */
  onToggleClick?: (event: MouseEvent | React.MouseEvent<any, MouseEvent> | React.KeyboardEvent<Element>) => void;
}

export const Compare = ({
  firstChild,
  secondChild,
  firstChildDisplayName,
  secondChildDisplayName,
  onToggleClick,
  toggleGroupAriaLabel = 'Select which chatbot to display'
}: PropsWithChildren<CompareProps>) => {
  const [isSelected, setIsSelected] = React.useState('toggle-group-chatbot-1');
  const [showFirstChatbot, setShowFirstChatbot] = React.useState(true);
  const [showSecondChatbot, setShowSecondChatbot] = React.useState(false);

  React.useEffect(() => {
    // we want to show the first if we switch to the mobile toggle view
    // and reset/switch back to normal otherwise
    const updateChatbotVisibility = () => {
      if (window.innerWidth >= 901) {
        setShowFirstChatbot(true);
        setShowSecondChatbot(true);
      } else {
        setShowFirstChatbot(true);
        setShowSecondChatbot(false);
        setIsSelected('toggle-group-chatbot-1');
      }
    };
    window.addEventListener('resize', updateChatbotVisibility);

    return () => {
      window.removeEventListener('resize', updateChatbotVisibility);
    };
  }, []);

  // this only happens on mobile
  const handleChildToggleClick = (
    event: MouseEvent | React.MouseEvent<any, MouseEvent> | React.KeyboardEvent<Element>
  ) => {
    const id = event.currentTarget.id;
    setIsSelected(id);
    setShowSecondChatbot(!showSecondChatbot);
    setShowFirstChatbot(!showFirstChatbot);
    onToggleClick && onToggleClick(event);
  };

  return (
    <>
      <div className="pf-chatbot__compare-mobile-controls">
        <ToggleGroup aria-label={toggleGroupAriaLabel}>
          <ToggleGroupItem
            className="pf-chatbot__compare-toggle"
            text={firstChildDisplayName}
            buttonId="toggle-group-chatbot-1"
            isSelected={isSelected === 'toggle-group-chatbot-1'}
            onChange={handleChildToggleClick}
          />
          <ToggleGroupItem
            className="pf-chatbot__compare-toggle"
            text={secondChildDisplayName}
            buttonId="toggle-group-chatbot-2"
            isSelected={isSelected === 'toggle-group-chatbot-2'}
            onChange={handleChildToggleClick}
          />
        </ToggleGroup>
      </div>
      <div className="pf-chatbot__compare">
        <div
          className={`pf-chatbot__compare-item ${!showFirstChatbot ? 'pf-chatbot__compare-item-hidden' : undefined}`}
        >
          {firstChild}
        </div>
        <div
          className={`pf-chatbot__compare-item ${!showSecondChatbot ? 'pf-chatbot__compare-item-hidden' : undefined}`}
        >
          {secondChild}
        </div>
      </div>
    </>
  );
};

export default Compare;
