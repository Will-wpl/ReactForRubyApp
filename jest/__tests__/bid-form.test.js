import React from 'react';
import renderer from 'react-test-renderer';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import { shallow } from 'enzyme';
require("babel-polyfill");
import BidForm from '../../app/webpack/components/retailer/live-dashboard/bid-form';
//import TestUtils from 'react-addons-test-utils';
//BidForm.initConfigs([0.1458,0.1458,0,0,0.1458,0.1458]);
const setup = () => {
  // 模拟 props
  const props = {
    onSubmitjest: jest.fn((e) => {
    }),
    data:[0.1458,0.1458,0,0,0.1458,0.1458]
  }

  const wrapper = shallow(<BidForm {...props} />)
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

describe('BidForm', () => {
  const { wrapper, props } = setup();
  it('BidForm Component should render', () => {
    expect(wrapper.find('.number_form').exists());
  });

  it('When click the submit, onSubmit() shoule be called', () => {
    const mockEvent = {
      key: 'Click',
    }
    wrapper.find('button').simulate('click', mockEvent);
    expect(props.onSubmitjest).toBeCalled()
  });
  
  // const component = shallowRender(<BidForm />);
  // component.initConfigs([0.1458,0.1458,0,0,0.1458,0.1458]);
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