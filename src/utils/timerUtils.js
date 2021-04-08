async function awaitableTimeout(cb, timeout) {
    return new Promise((resolve) => setTimeout(async () => {
        await cb();
        resolve();
    }, timeout));
};

module.exports = {
    awaitableTimeout
};
