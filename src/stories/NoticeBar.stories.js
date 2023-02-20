import NoticeBarDemo from './notice-bar';

export default {
  title: 'Example/NoticeBar',
  component: NoticeBarDemo,
};

const Template = () => ({
  components: { 
    NoticeBarDemo 
  },
  template: '<NoticeBarDemo />',
});

export const NoticeBar = Template.bind({});
