import type { Meta, StoryObj } from '@storybook/vue3';
import ScreenRegisterUser from './ScreenRegisterUser.vue';
import { within, userEvent } from '@storybook/test';
const meta: Meta<typeof ScreenRegisterUser> = {
  title: 'Views/ScreenRegisterUser',
  component: ScreenRegisterUser,
  parameters: {
    docs: {
      description: {
        component: 'Màn hình Register chạy cô lập trong Storybook với PrimeVue và router bộ nhớ.'
      }
    },
    layout: 'centered'
  }
};

export default meta;
type Story = StoryObj<typeof ScreenRegisterUser>;

export const Default: Story = {
  render: () => ({
    components: { ScreenRegisterUser },
    template: '<ScreenRegisterUser />'
  })
};


export const WithPrefilled: Story = {
  render: () => ({ components: { ScreenRegisterUser }, template: '<ScreenRegisterUser />' }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.type(c.getByPlaceholderText('Email'), 'john@doe.com');
    await userEvent.type(c.getByPlaceholderText('Password'), 'secret123');
    await userEvent.type(c.getByPlaceholderText('Confirm Password'), 'secret123');
  }
};

export const PasswordMismatch: Story = {
  render: () => ({ components: { ScreenRegisterUser }, template: '<ScreenRegisterUser />' }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.type(c.getByPlaceholderText('Email'), 'john@doe.com');
    await userEvent.type(c.getByPlaceholderText('Password'), 'secret123');
    await userEvent.type(c.getByPlaceholderText('Confirm Password'), 'secret456');
    await userEvent.click(c.getByRole('button', { name: /register/i }));
  }
};

export const TogglePasswordVisibility: Story = {
  render: () => ({ components: { ScreenRegisterUser }, template: '<ScreenRegisterUser />' }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    // Bấm 2 nút mắt cho password và confirm password
    await userEvent.type(c.getByPlaceholderText('Password'), 'secret123');
    await userEvent.type(c.getByPlaceholderText('Confirm Password'), 'secret123');
    const buttons = canvasElement.querySelectorAll('button.password-toggle');
    buttons.forEach((btn) => (btn as HTMLButtonElement).click());
  }
};


