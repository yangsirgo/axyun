
function Log(level) {
    this.level = level
}

Log.prototype.info = (message) => {
    console.log(`%c ${message}`, 'color:#2C4583');
}

Log.prototype.error = (error) => {
    console.error(error);
}

const logInst = new Log()

export default logInst