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
export const getRandomColor = (intNum, totallyRandom = false) => {
    // return '#' + ('00000' + (intNum * 0x1000000 << 0).toString(16)).slice(-6);
    if (!totallyRandom) {
        if (defaultColors.hasOwnProperty(intNum)) {
            return totallyRandom[intNum];
        }
    }
    return `#${(`00000${((Math.random() + intNum) * 0x1000000 << 0).toString(16)}`).slice(-6)}`;
}

export const getLoginUserId = () => {
    let element = document.getElementById('user_id');
    if (element) {
        return element.getAttribute('value');
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