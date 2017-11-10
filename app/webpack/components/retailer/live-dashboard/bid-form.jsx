import React, {Component} from 'react';

export default class BidForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            configs: ['0000', '0000', '0000', '0000', '0000', '0000'],
            changed: true,
            error:false
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({configs:nextProps.data.map(element => {
            return parseFloat(element).toFixed(4).substring(2);
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
            let target = this.props.data.find((element, index) => {
                return index === i;
            });
            if (Number(num) > Number(target) * 10000) {
                console.log('not allow', this.props.data);
            } else {
                this.setState({configs: this.state.configs.map((element, index) => {
                    if (index === i) {
                        element = num;
                    }
                    return element;
                })});
            }
        }
    }

    onSubmit() {
        let isChanged = this.state.configs.some((element, index) => {
            return Number(element) !== parseFloat(this.props.data[index]) * 10000;
        })
        console.log(isChanged);
        if (this.props.onSubmit && isChanged) {
            this.props.onSubmit(this.state.configs);
            this.setState({
                error:false
            })
        }else{
            this.setState({
                error:true
            })
            setTimeout(()=>{
                this.setState({
                    error:false
                })
            },5000)
        }
    }

    render() {
        let error_html = '';
        !this.state.error ? error_html ='' : error_html = <div className="number_error">Invalid submission. Please check that your bid submission fulfils the following criteria:<br/>
                                                                                        1.None of the values should be higher than its previous value<br/>
                                                                                        2.At least one of the values must be lower than its previous value</div>;
        return (
            <div className="number_form">
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
                        <td>Peak (7am-7pm)</td>
                        <td>$0.<input type="number" value={this.state.configs[1]} onChange={this.onInputChanged.bind(this, 1)}/></td>
                        <td>$0.<input type="number" value={this.state.configs[3]} onChange={this.onInputChanged.bind(this, 3)}/></td>
                        <td>$0.<input type="number" value={this.state.configs[5]} onChange={this.onInputChanged.bind(this, 5)}/></td>
                    </tr>
                    <tr>
                        <td>Off-Peak (7pm-7am)</td>
                        <td>$0.<input type="number" value={this.state.configs[0]} onChange={this.onInputChanged.bind(this, 0)}/></td>
                        <td>$0.<input type="number" value={this.state.configs[2]} onChange={this.onInputChanged.bind(this, 2)}/></td>
                        <td>$0.<input type="number" value={this.state.configs[4]} onChange={this.onInputChanged.bind(this, 4)}/></td>
                    </tr>

                    </tbody>
                </table>
                <button type="button" className="lm--button lm--button--primary u-mt2 fright" onClick={this.onSubmit.bind(this)}>Submit</button>
                {error_html}
            </form>
            </div>
        );
    }
}