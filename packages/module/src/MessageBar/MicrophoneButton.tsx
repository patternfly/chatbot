// ============================================================================
// Chatbot Footer - Message Bar - Microphone
// ============================================================================
import React from 'react';

// Import PatternFly components
import { Button, ButtonProps, Tooltip, TooltipProps, Icon } from '@patternfly/react-core';

// Import FontAwesome icons
import { MicrophoneIcon } from '@patternfly/react-icons/dist/esm/icons/microphone-icon';

export interface MicrophoneButtonProps extends ButtonProps {
  /** Boolean check if the browser is listening to speech or not */
  isListening: boolean;
  /** Class Name for the Microphone button */
  className?: string;
  /** Callback to update the value of isListening */
  onIsListeningChange: React.Dispatch<React.SetStateAction<boolean>>;
  /** Callback to update the message value once speech recognition is complete */
  onSpeechRecognition: React.Dispatch<React.SetStateAction<string>>;
  /** Props to control the PF Tooltip component */
  tooltipProps?: TooltipProps;
}

export const MicrophoneButton: React.FunctionComponent<MicrophoneButtonProps> = ({
  isListening,
  onIsListeningChange,
  onSpeechRecognition,
  className,
  tooltipProps,
  ...props
}: MicrophoneButtonProps) => {
  // Microphone
  // --------------------------------------------------------------------------
  const [speechRecognition, setSpeechRecognition] = React.useState<SpeechRecognition>();

  // Listen for speech
  const startListening = React.useCallback(() => {
    if (speechRecognition) {
      speechRecognition.start();
      onIsListeningChange(true);
    }
  }, [onIsListeningChange, speechRecognition]);

  // Stop listening for speech
  const stopListening = React.useCallback(() => {
    if (speechRecognition && isListening) {
      speechRecognition.stop();
      onIsListeningChange(false);
    }
  }, [isListening, onIsListeningChange, speechRecognition]);

  // Detect speech recognition browser support
  React.useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      // Initialize SpeechRecognition
      const recognition: SpeechRecognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const result = event.results[0][0].transcript;
        onSpeechRecognition(result);
        recognition.stop();
      };

      recognition.onerror = (event) => {
        // eslint-disable-next-line no-console
        console.error('Speech recognition error:', event.error);
        recognition.stop();
      };

      setSpeechRecognition(recognition);
    }
  }, [onSpeechRecognition]);

  if (!speechRecognition) {
    return null;
  }

  return (
    <Tooltip
      aria="none"
      aria-live="polite"
      id="pf-chatbot__tooltip--use-microphone"
      content={isListening ? 'Stop listening' : 'Use microphone'}
      position={tooltipProps?.position || 'top'}
      entryDelay={tooltipProps?.entryDelay || 0}
      exitDelay={tooltipProps?.exitDelay || 0}
      distance={tooltipProps?.distance || 8}
      animationDuration={tooltipProps?.animationDuration || 0}
      {...tooltipProps}
    >
      <Button
        variant="plain"
        className={`pf-chatbot__button--microphone ${isListening ? 'pf-chatbot__button--microphone--active' : ''} ${className ?? ''}`}
        aria-label={props['aria-label'] || 'Microphone Button'}
        onClick={isListening ? stopListening : startListening}
        icon={
          <Icon iconSize="xl" isInline>
            <MicrophoneIcon />
          </Icon>
        }
        {...props}
      />
    </Tooltip>
  );
};

export default MicrophoneButton;