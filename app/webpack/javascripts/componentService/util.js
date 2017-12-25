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

const defaultColors = ['#22ad38', '#ffff00', '#f53d0b', '#8ff830', '#f13de8', '#37b8ff', '#ffffff', '#ffc000'
    , '#3366ff', '#9933ff', '#868686', '#0ba55c', '#fa9106', '#ffafff', '#c00000', '#46f0f0', '#49702e', '#ffff99'
    , '#993300', '#8e8cf4']
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

export const getStandardNumBref = (num) => {
    return getNumBref(num, true);

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
        return {day, hour, minute, second, divider}
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