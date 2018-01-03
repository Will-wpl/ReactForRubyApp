import React from 'react';
import renderer from 'react-test-renderer';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import { shallow } from 'enzyme';
require("babel-polyfill");
import AdminInvitation from '../../app/webpack/components/admin/admin-invitation';
//import TestUtils from 'react-addons-test-utils';
//BidForm.initConfigs([0.1458,0.1458,0,0,0.1458,0.1458]);
const setup = () => {
  // 模拟 props
  const props = {
    onAddClick: jest.fn((e) => {
    }),
    text:"",
    fileData:{
            "tender_documents_upload":[{buttonName:"add",buttonText:"+"}],
            "birefing_pack_upload":[{buttonName:"add",buttonText:"+"}]
        }
  }

  const wrapper = shallow(<AdminInvitation {...props} />)
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

describe('AdminInvitation', () => {
  const { wrapper, props } = setup();
  it('AdminInvitation Component should render', () => {
    expect(wrapper.find('.admin_invitation').exists());
  });

  it('When click the submit, doPublish() shoule be called', () => {
    const mockEvent = {
      key: 'Click',
    }
    wrapper.find('#doPublish').simulate('click', mockEvent);
    expect(props.onAddClick).toBeCalled();
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