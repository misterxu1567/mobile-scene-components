const customViewports = {
  iphone6: {
    name: 'iPhone 6/7/8',
    styles: {
      width: '375px',
      height: '667px',
      background: '#f5f5f5',
    },
    type: 'mobile'
  },
};

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  viewport: { 
    viewports: customViewports, 
    defaultViewport: 'iphone6', 
  },
  layout: 'fullscreen',
  options: {
    panelPosition: "right"
  }
}