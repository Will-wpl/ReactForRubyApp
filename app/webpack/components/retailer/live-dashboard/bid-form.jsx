import React, {Component} from 'react';

export default class BidForm extends Component {

    constructor(props) {
        super(props);
        this.state = {configs: ['0000', '0000', '0000', '0000', '0000', '0000']}
    }

    componentWillReceiveProps(nextProps) {
        this.setState({configs:nextProps.data.map(element => {
            return parseFloat(element).toFixed(4) * 10000;
        })});
    }

    onInputChanged(i, e) {
        let num = parseInt(e.target.value);
        if (num < 10000) {
            if (num > 0) {
                num = parseFloat(num * 1.0 /10000).toFixed(4).substring(2);
            } else {
                num = '0000';
            }
            this.setState({configs: this.state.configs.map((element, index) => {
                if (index === i) {
                    element = num;
                }
                return element;
            })});
        }
    }
    render() {
        return (
            <form>
                <h3>Enter My Bids</h3>
                <table className="retailer_fill u-mt2">
                    <thead>
                    <tr>
                        <th></th>
                        <th>LT</th>
                        <th>HT(Small)</th>
                        <th>HT(Large)</th>
                    </tr>
                    </thead>
                    <tbody>

                    <tr>
                        <td>Peak</td>
                        <td>$0.<input type="number" value={this.state.configs[0]} onChange={this.onInputChanged.bind(this, 0)}/></td>
                        <td>$0.<input type="number" value={this.state.configs[2]} onChange={this.onInputChanged.bind(this, 2)}/></td>
                        <td>$0.<input type="number" value={this.state.configs[4]} onChange={this.onInputChanged.bind(this, 4)}/></td>
                    </tr>
                    <tr>
                        <td>Off-Peak</td>
                        <td>$0.<input type="number" value={this.state.configs[1]} onChange={this.onInputChanged.bind(this, 1)}/></td>
                        <td>$0.<input type="number" value={this.state.configs[3]} onChange={this.onInputChanged.bind(this, 3)}/></td>
                        <td>$0.<input type="number" value={this.state.configs[5]} onChange={this.onInputChanged.bind(this, 5)}/></td>
                    </tr>
                    </tbody>
                </table>
                <button className="lm--button lm--button--primary u-mt2 fright">Submit</button>
            </form>
        );
    }
}