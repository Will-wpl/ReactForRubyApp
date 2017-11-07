export const findUpLimit = (curValue) => {
    if (curValue > 0) {
        return curValue * 10 / Number(`${curValue}`.substr(0, 1));
    }
    return 0;
}

export const getRandomColor = (intNum) => {
    // return '#' + ('00000' + (intNum * 0x1000000 << 0).toString(16)).slice(-6);
    return `#${(`00000${((Math.random() + intNum) * 0x1000000 << 0).toString(16)}`).slice(-6)}`;
}

export const getLoginUserId = () => {
    let element = document.getElementById('user_id');
    if (element) {
        return element.getAttribute('value');
    }
    return 0;
}