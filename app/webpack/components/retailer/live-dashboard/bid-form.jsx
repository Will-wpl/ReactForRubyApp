import React, {Component} from 'react';

export default class BidForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            configs: ['0000', '0000', '0000', '0000', '0000', '0000'],
            changed: true,
            samePrice: false,
            thisStatus: false,
            status: [true, true, true, true, true, true]
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            configs: nextProps.data.map(element => {
                return parseFloat(element).toFixed(4).substring(2);
            }), status: this.state.status.map(element => {
                return true;
            })
        });
    }

    onInputChanged(i, e) {
        let num = parseInt(e.target.value);
        if (num < 10000) {
            if (num > 0) {
                num = parseFloat(num * 1.0 / 10000).toFixed(4).substring(2);
            } else {
                num = '0000';
            }
            let target = this.props.data.find((element, index) => {
                return index === i;
            });
            let status = this.state.status;
            if (Number(num) * 1.0 / 10000 > Number(target)) {
                status[i] = false;
            } else {
                status[i] = true;
            }
            this.setState({
                configs: this.state.configs.map((element, index) => {
                    if (index === i) {
                        element = num;
                    }
                    return element;
                }), status: status
            });
        }
    }

    onSubmit() {
        this.setState({
            thisStatus: true
        })
        let isChanged = this.state.configs.some((element, index) => {
            //console.log("state:"+Number(element) / 10000+"--------props:"+parseFloat(this.props.data[index]));
            return Number(element) / 10000 < Number(this.props.data[index]);
        })
        if (this.props.onSubmit && isChanged) {
            this.props.onSubmit(this.state.configs);
            this.setState({
                samePrice: false
            })
            setTimeout(() => {
                this.setState({
                    samePrice: true,
                    thisStatus: false
                })
            }, 5000)
        } else {
            this.setState({
                samePrice: true
            })
            setTimeout(() => {
                this.setState({
                    samePrice: false,
                    thisStatus: false
                })
            }, 5000)
        }
    }

    render() {
        let error_html;
        if (this.state.thisStatus) {
            error_html = !this.state.samePrice ?
                <div className="number_error">Your bid has been successfully submitted.</div>
                : <div className="number_error">Invalid submission. Please check that your bid submission fulfils the
                    following criteria:<br/>
                    1.None of the values should be higher than its previous value<br/>
                    2.At least one of the values must be lower than its previous value</div>;
        }
        let illegal;
        if (this.state.status.some(element => {
                return !element
            })) {
            illegal = <p className="number_error" style={{color: 'red'}}>need lesser</p>;
        }
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
                            <td>$0.<input type="number" value={this.state.configs[1]}
                                          style={{borderColor: this.state.status[1] ? 'white' : 'red'}}
                                          onChange={this.onInputChanged.bind(this, 1)}/></td>
                            <td>$0.<input type="number" value={this.state.configs[3]}
                                          style={{borderColor: this.state.status[3] ? 'white' : 'red'}}
                                          onChange={this.onInputChanged.bind(this, 3)}/></td>
                            <td>$0.<input type="number" value={this.state.configs[5]}
                                          style={{borderColor: this.state.status[5] ? 'white' : 'red'}}
                                          onChange={this.onInputChanged.bind(this, 5)}/></td>
                        </tr>
                        <tr>
                            <td>Off-Peak (7pm-7am)</td>
                            <td>$0.<input type="number" value={this.state.configs[0]}
                                          style={{borderColor: this.state.status[0] ? 'white' : 'red'}}
                                          onChange={this.onInputChanged.bind(this, 0)}/></td>
                            <td>$0.<input type="number" value={this.state.configs[2]}
                                          style={{borderColor: this.state.status[2] ? 'white' : 'red'}}
                                          onChange={this.onInputChanged.bind(this, 2)}/></td>
                            <td>$0.<input type="number" value={this.state.configs[4]}
                                          style={{borderColor: this.state.status[4] ? 'white' : 'red'}}
                                          onChange={this.onInputChanged.bind(this, 4)}/></td>
                        </tr>

                        </tbody>
                    </table>
                    {illegal}
                    <button type="button" className="lm--button lm--button--primary u-mt2 fright"
                            onClick={this.onSubmit.bind(this)}>Submit
                    </button>
                    {error_html}
                </form>
            </div>
        );
    }
}