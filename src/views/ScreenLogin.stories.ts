import type { Meta, StoryObj } from '@storybook/vue3';
import ScreenLogin from './ScreenLogin.vue';
import { within, userEvent, expect } from '@storybook/test';

const meta: Meta<typeof ScreenLogin> = {
  title: 'Views/ScreenLogin',
  component: ScreenLogin,
  parameters: {
    docs: {
      description: {
        component: 'Màn hình Login chạy cô lập trong Storybook với PrimeVue và router bộ nhớ.'
      }
    },
    layout: 'centered'
  }
};

export default meta;
type Story = StoryObj<typeof ScreenLogin>;

export const Default: Story = {
  render: () => ({
    components: { ScreenLogin },
    template: '<ScreenLogin />'
  })
};


export const WithPrefilled: Story = {
  render: () => ({
    components: { ScreenLogin },
    template: '<ScreenLogin />',
    mounted() {
      // Điền sẵn dữ liệu để mô phỏng state đã nhập
      const email = this.$el.querySelector('input[placeholder="E-mail address"]') as HTMLInputElement | null;
      const pass = this.$el.querySelector('input[placeholder="Password"]') as HTMLInputElement | null;
      if (email) email.value = 'john@doe.com';
      if (pass) pass.value = 'secret123';
    }
  })
};

export const ShowPassword: Story = {
  render: () => ({ components: { ScreenLogin }, template: '<ScreenLogin />' }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.type(c.getByPlaceholderText('E-mail address'), 'john@doe.com');
    await userEvent.type(c.getByPlaceholderText('Password'), 'secret123');
    await userEvent.click(c.getByRole('button', { name: /Hiện mật khẩu/i }));
  }
};

export const ValidationErrors: Story = {
  render: () => ({ components: { ScreenLogin }, template: '<ScreenLogin />' }),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole('button', { name: /login/i }));
  }
};

// export const SuccessfulLoginNav: Story = {
//   render: () => ({ components: { ScreenLogin }, template: '<ScreenLogin />' }),
//   play: async ({ canvasElement }) => {
//     const c = within(canvasElement);
//     await userEvent.type(c.getByPlaceholderText('E-mail address'), 'john@doe.com');
//     await userEvent.type(c.getByPlaceholderText('Password'), 'secret123');
//     await userEvent.click(c.getByRole('button', { name: /login/i }));
//     // Không assert routing, chỉ mô phỏng tương tác
//     await expect(c.getByRole('button', { name: /login/i })).toBeInTheDocument();
//   }
// };


