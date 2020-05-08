module.exports = (service, server, willcore) => {
    service.getData.action.get = async (model) => {
        let result = [];
        for (let i = 0; i < model.resultCount; i++) {
            result.push({ one: model.value, index: i });
        }
        model.result = result;
    };
    service.postData.action.post = async (model) => {
        let result = [];
        for (let i = 0; i < model.resultCount * 2; i++) {
            result.push({ one: model.value, index: i });
        }
        model.result = result;
    };
    service.hasAccess.action.get = async (model) => {
        model.hasAccess = false;
    };
};