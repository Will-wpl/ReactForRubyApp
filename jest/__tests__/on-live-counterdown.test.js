import React from 'react';
import renderer from 'react-test-renderer';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import { shallow } from 'enzyme';
require("babel-polyfill");
import CounterDownShowOnLive from '../../app/webpack/components/shared/on-live-counterdown';
//import TestUtils from 'react-addons-test-utils';
//BidForm.initConfigs([0.1458,0.1458,0,0,0.1458,0.1458]);
const setup = () => {
  // 模拟 props
  const props = {
    hour: 10,
    minute: 5,
    second: 35
  }

  const wrapper = shallow(<CounterDownShowOnLive {...props} />)
  return {
    props,
    wrapper
  }
}

// const shallowRender = (Component) => {
//   const renderer = TestUtils.createRenderer();
//   renderer.render(<Component/>);
//   return renderer.getRenderOutput();
// }

describe('CounterDownShowOnLive', () => {
  const { wrapper, props } = setup();
  it('CounterDownShowOnLive Component should render', () => {
    expect(wrapper.find('.time_cuntdown.during').exists());
    expect(wrapper.find('#during_countdown_timer_hour').text()).toEqual("10");
    expect(wrapper.find('#during_countdown_timer_minute').text()).toEqual("5");
    expect(wrapper.find('#during_countdown_timer_second').text()).toEqual("35");
  });
})




















// const setup = () => {
//   // 模拟 props
//   const props = {
//     // Jest 提供的mock 函数
//     onAddClick: jest.fn()
//   }

//   // 通过 enzyme 提供的 shallow(浅渲染) 创建组件
// const wrapper = shallow(<RetailerRanking {...props} />)
//   return {
//     props,
//     wrapper
//   }
// }
// describe('CreateNewRADom', () => {
//   const { wrapper, props } = setup();
//   it('CreateNewRADom Component should be render', () => {
//     expect(wrapper.find('table').exists());
//   })
// })