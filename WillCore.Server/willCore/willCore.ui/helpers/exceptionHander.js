class _execptionHander {
    handleExeception(error, detail) {
        var data = `<h1 style="color:white;margin-top:200px">WillCore Error</h1><br/><h2 style="color:white">${error}</h2><p style="color:white">${detail}</p>`;
        document.getElementsByTagName("BODY")[0].innerHTML = data;
        document.getElementsByTagName("BODY")[0].style.textAlign = "center";
        document.getElementsByTagName("BODY")[0].style.backgroundColor = "#1a1a1a";
        document.getElementsByTagName("BODY")[0].style.color = "white";
    }
};
var execptionHander = {
    getFactoryInstance: () => new _execptionHander()
};
export { execptionHander };