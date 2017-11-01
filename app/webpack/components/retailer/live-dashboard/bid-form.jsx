import React, { Component } from 'react';

export default class BidForm extends Component {

    render() {
        return (
            <form>
                <h3>Enter My Bids</h3>
                <table>
                    <tbody>
                        <tr>
                            <th></th>
                            <th>LT</th>
                            <th>HT(Small)</th>
                            <th>HT(Large)</th>
                        </tr>
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
                <button>Submit</button>
            </form>
        );
    }
}