import moment from 'moment';
export const findUpLimit = (curValue) => {
    if (curValue > 0) {
        let arr = `${curValue}`.split('').map((element, index) => {
            return element = index === 0 ? '1' : '0';
        });
        arr.push('0');
        // return curValue * 10 / Number(`${curValue}`.substr(0, 1));
        return arr.join('');
    }
    return 1;
}

export const findUpLimitZero = (curValue) => {
    if (curValue) {
        if (curValue.indexOf('.') > 0) {
            let arr = curValue.split('');
            for (let i = 0; i < 6; i++) {
                arr[i] = arr[i] == '0' ? arr[i] : (arr[i] ? arr[i] : '0');
            }
            return arr.join('');
        } else {
            return curValue
        }
    }
}

const defaultColors = ['#056b07', '#3384e0', '#f53d0b', '#48ddc0', '#e5e5e5', '#ffe65b', '#ec0033', '#241594'
    , '#168694', '#7c1212', '#ff9c5a', '#dc52e5', '#fc5098', '#32e333', '#6850d8', '#bfc8cf', '#891592', '#b50c83'
    , '#2b8a2c', '#3b2e7d'];
//['#22ad38', '#ff26ff', '#f53d0b', '#8ff830', '#f13de8', '#37b8ff', '#001a66', '#ffc000'
//, '#3366ff', '#9933ff', '#868686', '#0ba55c', '#fa9106', '#ffafff', '#c00000', '#46f0f0', '#49702e', '#ffff99'
//, '#993300', '#8e8cf4']
export const getRandomColor = (intNum, limit = 100, totallyRandom = false) => {
    // return '#' + ('00000' + (intNum * 0x1000000 << 0).toString(16)).slice(-6);
    // return `#${(`00000${((Math.random() + intNum) * 0x1000000 << 0).toString(16)}`).slice(-6)}`;
    if (!totallyRandom) {
        if (defaultColors.hasOwnProperty(intNum)) {
            return defaultColors[intNum];
        }
    }
    return `#${(`00000${((Math.random() + intNum * 1.0 / limit) * 0x1000000 << 0).toString(16)}`).slice(-6)}`;
}

export const getLoginUserId = () => {
    let element = document.getElementById('user_id');
    if (element) {
        return element.getAttribute('value');
    }
    return 0;
}

export const getSearchType = () => {
    let element = $('.search_list_type');
    if (element) {
        return element.text();
    }
    return 0;
}


export const getNumBref = (num, standard = false) => {
    if (num <= 0) {
        return `${num}`
    }
    if (num >= 11 && num <= 13) {
        return `${num}th`;
    }
    let splices = Number(num).toString().split('');
    let lastEle = splices[splices.length - 1];
    let suffix;
    switch (Number(lastEle)) {
        case 1:
            suffix = 'st';
            break;
        case 2:
            suffix = standard ? 'nd' : '';
            break;
        case 3:
            suffix = 'rd';
            break;
        default:
            suffix = 'th';
            break;
    }
    splices[splices.length - 1] = `${lastEle}${suffix}`;
    return splices.join('');

}


export const trim = (str) => {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}


export const replaceSymbol = (str) => {

    let value = str.replace((/\,|\"/g), "");
    return value;
}

export const getStandardNumBref = (num) => {
    return getNumBref(num, true);

}

export const validateNum = (value) => {
    let num = /^(\d{8})$/g;
    if (!num.test(value)) {
        return false;
    }

    return true;
}
export const validateNum4 = (value) => {
    let num = /^(0|[1-9][0-9]*)$/;
    if (value > 0) {
        if (!num.test(value)) {
            return false;
        }
    }
    else {
        return false;
    }
    return true;
}
export const validateNum10 = (value) => {
    let num = /^\+?[1-9]\d*$/;
    if (value > 0) {
        if (!num.test(value)) {
            return false;
        }
    }
    else {
        return false;
    }
    return true;
}



export const validateEmail = (value) => {
    let num = /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
    if (!num.test(value)) {
        return false;
    }
    return true;
}
export const validateDecimal = (value) => {
    let num = /^100$|^(\d|[1-9]\d)(\.\d+)*$/;
    if (value >= 0) {
        if (!num.test(value)) {
            return false;
        }
    }
    else {
        return false;
    }
    return true;
}

export const validateLess100 = (value) => {

    let num = /^(?:0|[1-9][0-9]?|100)$/;
    if (value >= 0) {
        if (!num.test(value)) {

            return false;
        }
    }
    else {

        return false;
    }
    return true;
}

export const validateInteger = (value) => {
    let express = /^[0-9]*[1-9][0-9]*$/;
    if (value > 0) {
        if (!express.test(value)) {
            return false;
        }
    } else {
        return false;
    }
    return true;
}



export const validateTwoDecimal = (value) => {
    let total;
    let decimalValue = value.split('.')[1];

    if (decimalValue) {
        if (decimalValue.length > 2) {
            total = value.split('.')[0] + "." + value.split('.')[1].substr(0, 2);
        }
        else {
            total = value;
        }
    }
    else {
        total = value;
    }
    let num = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
    if (total > 0) {
        if (!num.test(total)) {
            return false;
        }
    }
    else {
        return false;
    }
    return true;
}



export const validatePostCode = (value) => {
    let express = /^[0-9]{6}$/;
    if (value > -1) {
        if (!express.test(value)) {
            return false;
        }
    } else {
        return false;
    }
    return true;
}
export const validator_Object = (param, paramType) => {
    let errArr = [];
    for (let key in paramType) {
        var value = param[key];
        var type = paramType[key];

        if (value == null) continue;
        if (type.cate === 'email') {
            if (value === null || value.length === 0) {
                errArr.push({ column: key, cate: 1 });
            }
            else {
                if (!validateEmail(value)) {
                    errArr.push({ column: key, cate: 2 })
                }
            }
        }
        else if (type.cate === 'num') {
            if (value === null || value.length === 0) {
                errArr.push({ column: key, cate: 1 });
            }
            else {
                if (!validateNum(value)) {
                    errArr.push({ column: key, cate: 2 })
                }
            }
        }
        else if (type.cate === 'num4') {
            if (value === null || value.length === 0) {
                errArr.push({ column: key, cate: 1 });
            }
            else {
                if (!validateNum4(value)) {
                    errArr.push({ column: key, cate: 2 })
                }
            }
        }
        else if (type.cate === 'num10') {
            if (value === null || value.length === 0) {
                errArr.push({ column: key, cate: 1 });
            }
            else {
                if (!validateNum10(value)) {
                    errArr.push({ column: key, cate: 2 })
                }
            }
        }
        else if (type.cate === 'postcode') {
            //^\\d{6}$
            if (value === null || value.length === 0) {
                errArr.push({ column: key, cate: 1 });
            }
            else {
                if (!validatePostCode(value)) {
                    errArr.push({ column: key, cate: 2 })
                }
            }
        }
        else if (type.cate === 'decimal') {
            if (value === null || value.length === 0) {
                errArr.push({ column: key, cate: 1 });
            }
            else {
                if (!validateDecimal(value)) {
                    errArr.push({ column: key, cate: 2 })
                }
            }
        }
        else if (type.cate === 'decimalTwo') {
            if (value === null || value.length === 0) {
                errArr.push({ column: key, cate: 1 });
            }
            else {
                if (!validateTwoDecimal(value)) {
                    errArr.push({ column: key, cate: 2 })
                }
            }
        }
        else if (type.cate === 'integer') {
            if (value === null || value.length === 0) {
                errArr.push({ column: key, cate: 1 });
            }
            else {
                if (!validateInteger(value)) {
                    errArr.push({ column: key, cate: 2 })
                }
            }
        }
        else if (type.cate === 'less100integer') {
            if (value === null || value.length === 0) {
                errArr.push({ column: key, cate: 1 });
            }
            else {
                if (!validateLess100(value)) {
                    errArr.push({ column: key, cate: 2 })
                }
            }
        }
        else {
            let require = /^$/g;
            if (value === null || value.length === 0 || require.test(value)) {
                errArr.push({ column: key, cate: 1 })
            }
        }
    }
    return errArr;
}
export const validator_Array = (param, paramType) => {
    let errArr = [];
    for (let i = 0; i < param.length; i++) {
        let entityArr = [];
        for (let key in paramType) {
            var value = param[i][key];
            var type = paramType[key];
            if (value == null) continue;
            if (type.cate === 'email') {
                if (value === null || value.length === 0) {
                    entityArr.push({ column: key, cate: 1, ind: i });
                }
                else {
                    if (!validateEmail(value)) {
                        entityArr.push({ column: key, cate: 2, ind: i })
                    }
                }
            }
            else if (type.cate === 'num') {
                if (value === null || value.length === 0) {
                    entityArr.push({ column: key, cate: 1, ind: i });
                }
                else {
                    if (!validateNum(value)) {
                        entityArr.push({ column: key, cate: 2, ind: i })
                    }
                }
            }
            else {
                let require = /^$/g;
                if (value === null || value.length === 0 || require.test(value)) {
                    entityArr.push({ column: key, cate: 1, ind: i })
                }
            }
        }
        errArr.push(entityArr);
    }
    return errArr;

}

export const setValidationFaild = (item, type) => {

    if (type === 1) {
        $('#' + item + "_message").removeClass('isPassValidate').addClass('errormessage');
        $('#' + item + "_format").removeClass('errormessage').addClass('isPassValidate');
        $('#' + item + "_repeat").removeClass('errormessage').addClass('isPassValidate');
        $("input[name='" + item + "']").focus();
        $("input[name='" + item.split('user_')[1] + "']").focus();
    }
    else {
        $('#' + item + "_message").removeClass('errormessage').addClass('isPassValidate');
        $('#' + item + "_format").removeClass('isPassValidate').addClass('errormessage');
        $('#' + item + "_repeat").removeClass('errormessage').addClass('isPassValidate');
        $("input[name='" + item + "']").focus();
        $("input[name='" + item.split('user_')[1] + "']").focus();
    }
}
export const setValidationPass = (item, type) => {
    if (type === 1) {
        $('#' + item + "_message").removeClass('errormessage').addClass('isPassValidate');

    }
    else {
        $('#' + item + "_message").removeClass('errormessage').addClass('isPassValidate');
        $('#' + item + "_format").removeClass('errormessage').addClass('isPassValidate');
        $('#' + item + "_repeat").removeClass('errormessage').addClass('isPassValidate');
    }
}

export const removeNanNum = (value) => {

    value.target.value = value.target.value.replace(/[^\d.]/g, "");
    value.target.value = value.target.value.replace(/\.{2,}/g, ".");
    value.target.value = value.target.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    if (value.target.value.indexOf(".") < 0 && value.target.value != "") {
        value.target.value = parseFloat(value.target.value);
    }
    return value;
}
export const removePostCode = (value) => {
    value.target.value = value.target.value.replace(/[^\d.]/g, "");
    value.target.value = value.target.value.replace(/\.{2,}/g, ".");
    value.target.value = value.target.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    return value;
}
export const removeDecimal = (value) => {
    let decimalValue = value.target.value.split('.')[1];
    if (decimalValue) {
        if (decimalValue.length > 2) {
            decimalValue = decimalValue.substr(0, 2);
            value.target.value = value.target.value.split('.')[0] + "." + decimalValue;
            if (value.target.value != 0) {
                $("#totals_format").removeClass("errormessage").addClass("isPassValidate");
            }
        }
        if (decimalValue.length <= 2) {
            if (value.target.value != 0) {
                $("#totals_format").removeClass("errormessage").addClass("isPassValidate");
            }
        }
    }
    return value;
}
export const removeAsInteger = (value) => {
    // value.target.value = value.target.value.replace(/[^\d.]/g, "");
    // value.target.value = value.target.value.replace(/\.{2,}/g, ".");
    // value.target.value = value.target.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    // if (value.target.value.indexOf('.') > -1) {
    //     if (value.target.value > 0) {
    //         value.target.value = value.target.value.substr(0, value.target.value.length - 1)
    //     }
    // }

    // return value;

    value = value.replace(/[^\d.]/g, "");
    value = value.replace(/\.{2,}/g, ".");
    value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    if (value.indexOf('.') > -1) {
        if (value > 0) {
            value = value.substr(0, value.length - 1)
        }
    }

    return value;
}

export const removeAsIntegerPercent = (value) => {
    // value.target.value = value.target.value.replace(/[^\d.]/g, "");
    // value.target.value = value.target.value.replace(/\.{2,}/g, ".");
    // value.target.value = value.target.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    // if (value.target.value.indexOf('.') > -1) {
    //     if (value.target.value > 0) {
    //         value.target.value = value.target.value.substr(0, value.target.value.length - 1)
    //         if (value.target.value <= 100 && value.target.value >= 0) {
    //             $("#peak_pct_format").removeClass("errormessage").addClass("isPassValidate");
    //         }
    //     }
    // }
    // else {
    //     if (value.target.value <= 100 && value.target.value >= 0) {
    //         $("#peak_pct_format").removeClass("errormessage").addClass("isPassValidate");
    //     }
    // }
    // return value;
    value = value.replace(/[^\d.]/g, "");
    value = value.replace(/\.{2,}/g, ".");
    value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    if (value.indexOf('.') > -1) {
        if (value > 0) {
            value = value.substr(0, value.length - 1)
            if (value <= 100 && value >= 0) {
                $("#peak_pct_format").removeClass("errormessage").addClass("isPassValidate");
            }
        }
    }
    else {
        if (value <= 100 && value >= 0) {
            $("#peak_pct_format").removeClass("errormessage").addClass("isPassValidate");
        }
    }
    return value;
}

export const changeValidate = (type, value) => {
    if (value) {
        setValidationPass(type, 1);

    }
    else {
        setValidationFaild(type, 1);
    }
}

export const isEmptyJsonObj = (obj) => {
    if (!obj) {
        return true;
    }
    for (let item in obj) {
        return false;
    }
    return true;
}

export const getDHMSbetweenTwoTimes = (startSeq, nowSeq) => {
    let divider = parseInt((moment(startSeq).toDate().getTime() - moment(nowSeq).toDate().getTime()) / 1000);
    if (!isNaN(divider)) {
        const day = Math.floor(divider / (60 * 60 * 24));
        const hour = Math.floor((divider - day * 24 * 60 * 60) / 3600);
        const minute = Math.floor((divider - day * 24 * 60 * 60 - hour * 3600) / 60);
        const second = Math.floor(divider - day * 24 * 60 * 60 - hour * 3600 - minute * 60);
        return { day, hour, minute, second, divider }
    }
    return {
        day: 0,
        hour: 0,
        minute: 0,
        second: 0,
        divider: 0
    }
}

export const calTwoTimeSpace = (startSeq, nowSeq) => {
    let time = getDHMSbetweenTwoTimes(startSeq, nowSeq);
    return time.day || time.hour || time.minute || time.second;
}

//params：formatNum,num after doc, power symbol, thousand seperator, num after doc seperator
export const formatPower = (number, places, symbol, thousand, decimal) => {
    number = number || 0;
    places = !isNaN(places = Math.abs(places)) ? places : 2;
    symbol = symbol !== undefined ? symbol : "$";
    thousand = thousand || ",";
    decimal = decimal || ".";
    let negative = number < 0 ? "-" : "",
        i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
}

export const setApprovalStatus = (status, dt) => {
    let approvalStatus = null;
    let approvalDateTime = '(' + moment(dt).format('DD MMM YYYY hh:mm a') + ')';
    switch (status) {
        case '0':
            approvalStatus = 'Rejected ' + approvalDateTime;
            break;
        case '1':
            approvalStatus = 'Approved ' + approvalDateTime;
            break;
        case '2':
            approvalStatus = 'Pending';
            break;
        case '3':
            approvalStatus = 'Registering';
            break;
        case '5':
            approvalStatus = 'Deleted ' + approvalDateTime;;
            break;
        default:
            approvalStatus = 'Registering';
            break;
    }
    return approvalStatus;
}


export const getUserApprovalStatus = (status) => {
    let approvalStatus = null;
    switch (status) {
        case '0':
            approvalStatus = 'Rejected';
            break;
        case '1':
            approvalStatus = 'Approved';
            break;
        case '2':
            approvalStatus = 'Pending';
            break;
        case '3':
            approvalStatus = 'Registering';
            break;
        case '4':
            approvalStatus = 'Disabled';
            break;
        case '5':
            approvalStatus = 'Deleted';
            break;
        default:
            approvalStatus = 'Registering';
            break;
    }
    return approvalStatus;
}

export const getStatus = (type) => {
    let status = "Pending";
    switch (parseInt(type)) {
        case 0:
            status = "Rejected"
            break;
        case 1:
            status = "Approved"
            break;
        default:
            status = "Pending"
            break;
    }
    return status;
}
