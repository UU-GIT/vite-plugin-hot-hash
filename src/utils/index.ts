const handleZero = (number: number) => {
    if (number < 10) {
        return `0${number}`;
    }
    return '' + number;
};

module.exports = {
    formatDate: (date: Date) => {
        if (date instanceof Date) {
            const year = date.getFullYear();
            const month = handleZero(date.getMonth() + 1);
            const day = handleZero(date.getDate());
            const hour = handleZero(date.getHours());
            const minute = handleZero(date.getMinutes());
            const second = handleZero(date.getSeconds());
            return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
        }
        throw new Error('The data type is incorrect. It should be in the date format');
    }
};
