module.exports = (view) => {
    view.userData = (view) => {
        loadFromDB(view.userInfo.userId);
    }
};