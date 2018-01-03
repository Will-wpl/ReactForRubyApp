import React from 'react';
import renderer from 'react-test-renderer';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import { shallow } from 'enzyme';
require("babel-polyfill");
import AdminComsumptionList from '../../app/webpack/components/admin/admin_shared/admin-comsumption-list';
//import TestUtils from 'react-addons-test-utils';
//BidForm.initConfigs([0.1458,0.1458,0,0,0.1458,0.1458]);
const setup = () => {
  // 模拟 props
  const props = {
    onAddClick: jest.fn((e) => {
    }),
    comsumption_list : [
        {
            name:"Company Name 01",
            accounts:"6",
            lt_peak:"5431",
            lt_off_peak:"5431",
            hts_peak:"5431",
            hts_off_peak:"5431",
            htl_peak:"5431",
            htl_off_peak:"5431",
            unit:"kWh",
            table:[
                {account_number:"A0545454",intake_level:"HTL",peak_volume:"5233",off_peak_volume:"8455"},
                {account_number:"A0545454",intake_level:"HTL",peak_volume:"5233",off_peak_volume:"8455"},
                {account_number:"A0545454",intake_level:"HTL",peak_volume:"5233",off_peak_volume:"8455"}
            ]
        },
        {
            name:"Company Name 02",
            accounts:"5",
            lt_peak:"5431",
            lt_off_peak:"5431",
            hts_peak:"5431",
            hts_off_peak:"5431",
            htl_peak:"5431",
            htl_off_peak:"5431",
            unit:"kWh",
            table:[
                {account_number:"A0545454",intake_level:"HTL",peak_volume:"5233",off_peak_volume:"8455"},
                {account_number:"A0545454",intake_level:"HTL",peak_volume:"5233",off_peak_volume:"8455"},
                {account_number:"A0545454",intake_level:"HTL",peak_volume:"5233",off_peak_volume:"8455"}
            ]
        },
      ]
  }

  const wrapper = shallow(<AdminComsumptionList {...props} />)
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

describe('AdminComsumptionList', () => {
  const { wrapper, props } = setup();
  it('AdminComsumptionList Component should render', () => {
    expect(wrapper.find('.comsumption_list').exists());
  });

  it('When click the submit, show_table() shoule be called', () => {
    const mockEvent = {
      key: 'Click',
    }
    wrapper.find('button').simulate('click', mockEvent);
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