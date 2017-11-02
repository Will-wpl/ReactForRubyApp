import React, { Component } from 'react';

export default class BidForm extends Component {

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
                            <td>abc</td>
                            <td>$0.<input /></td>
                            <td>$0.<input /></td>
                            <td>$0.<input /></td>
                        </tr>
                        <tr>
                            <td>123</td>
                            <td>$0.<input /></td>
                            <td>$0.<input /></td>
                            <td>$0.<input /></td>
                        </tr>
                    </tbody>
                </table>
                <button className="lm--button lm--button--primary u-mt2 fright">Submit</button>
            </form>
        );
    }
}