module.exports = (view) => {
    view.login = (view) => {
        view.loginData.two = 5;
        view.serverSideCounter = { counter: 0 };

        for (var i = 0; i < 10; i++) {
            let counter = i;
            setTimeout(() => {
                view.serverSideCounter.counter = counter;
                if (counter== 9) {
                    view.done();
                }
            }, i * 1000);
        }
    }
};