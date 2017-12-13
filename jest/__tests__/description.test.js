import React from 'react';
import renderer from 'react-test-renderer';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import { shallow } from 'enzyme';
require("babel-polyfill");
import Description from '../../app/webpack/components/retailer/live-dashboard/description';

const setup = () => {
  // 模拟 props
  const props = {
    ranking:"TOP 2"
  }

  const wrapper = shallow(<Description {...props} />)
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

describe('Description', () => {
  const { wrapper, props } = setup();
  it('Description Component should render', () => {
    expect(wrapper.find('h2').text()).toEqual("TOP 2");
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