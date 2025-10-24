import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Onboarding from './Onboarding';

const handleModalToggle = jest.fn();
const onPrimaryAction = jest.fn();
const onSecondaryAction = jest.fn();

const body =
  'Experience personalized assistance and seamless problem-solving, simplifying your journey with Red Hat every step of the way.';

describe('Onboarding', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should render modal correctly', () => {
    render(
      <Onboarding
        isModalOpen
        onSecondaryAction={onSecondaryAction}
        handleModalToggle={handleModalToggle}
        ouiaId="Terms"
      >
        {body}
      </Onboarding>
    );
    expect(screen.getByRole('heading', { name: /Onboarding/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Continue/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Skip/i })).toBeTruthy();
    expect(screen.getByText(body)).toBeTruthy();
    expect(screen.getByRole('dialog')).toHaveClass('pf-chatbot__onboarding-modal');
    expect(screen.getByRole('dialog')).toHaveClass('pf-chatbot__onboarding-modal--default');
  });
  it('should handle image and altText props', () => {
    render(
      <Onboarding
        isModalOpen
        onSecondaryAction={onSecondaryAction}
        handleModalToggle={handleModalToggle}
        image="./image.png"
        altText="Test image"
      >
        {body}
      </Onboarding>
    );
    expect(screen.getByRole('img')).toBeTruthy();
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Test image');
  });
  it('should handle className prop', () => {
    render(
      <Onboarding
        isModalOpen
        onSecondaryAction={onSecondaryAction}
        handleModalToggle={handleModalToggle}
        className="test"
      >
        {body}
      </Onboarding>
    );
    expect(screen.getByRole('dialog')).toHaveClass('pf-chatbot__onboarding-modal');
    expect(screen.getByRole('dialog')).toHaveClass('pf-chatbot__onboarding-modal--default');
    expect(screen.getByRole('dialog')).toHaveClass('test');
  });
  it('should handle title prop', () => {
    render(
      <Onboarding
        isModalOpen
        onSecondaryAction={onSecondaryAction}
        handleModalToggle={handleModalToggle}
        title="Updated title"
      >
        {body}
      </Onboarding>
    );
    expect(screen.getByRole('heading', { name: /Updated title/i })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: /Onboarding/i })).toBeFalsy();
  });
  it('should handle primary button prop', () => {
    render(
      <Onboarding
        isModalOpen
        onSecondaryAction={onSecondaryAction}
        handleModalToggle={handleModalToggle}
        primaryActionBtn="First"
      >
        {body}
      </Onboarding>
    );
    expect(screen.getByRole('button', { name: /First/i })).toBeTruthy();
    expect(screen.queryByRole('button', { name: /Continue/i })).toBeFalsy();
  });
  it('should handle secondary button prop', () => {
    render(
      <Onboarding
        isModalOpen
        onSecondaryAction={onSecondaryAction}
        handleModalToggle={handleModalToggle}
        secondaryActionBtn="Second"
      >
        {body}
      </Onboarding>
    );
    expect(screen.getByRole('button', { name: /Second/i })).toBeTruthy();
    expect(screen.queryByRole('button', { name: /Skip/i })).toBeFalsy();
  });
  it('should handle primary button click', async () => {
    render(
      <Onboarding
        isModalOpen
        onPrimaryAction={onPrimaryAction}
        onSecondaryAction={onSecondaryAction}
        handleModalToggle={handleModalToggle}
      >
        {body}
      </Onboarding>
    );
    await userEvent.click(screen.getByRole('button', { name: /Continue/i }));
    expect(onPrimaryAction).toHaveBeenCalledTimes(1);
    expect(handleModalToggle).toHaveBeenCalledTimes(1);
  });
  it('should handle secondary button click', async () => {
    render(
      <Onboarding isModalOpen onSecondaryAction={onSecondaryAction} handleModalToggle={handleModalToggle}>
        {body}
      </Onboarding>
    );
    await userEvent.click(screen.getByRole('button', { name: /Skip/i }));
    expect(onSecondaryAction).toHaveBeenCalledTimes(1);
    expect(handleModalToggle).not.toHaveBeenCalled();
  });
});
