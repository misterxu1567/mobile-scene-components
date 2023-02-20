import WaterfallDemo from './waterfall';

export default {
  title: 'Example/Waterfall',
  component: WaterfallDemo,
};

const Template = () => ({
  components: { 
    WaterfallDemo 
  },
  template: '<WaterfallDemo />',
});

export const Waterfall = Template.bind({});
