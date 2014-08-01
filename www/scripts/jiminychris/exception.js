define(function () {
    return function Exception(message)
    {
       this.message = message;
       this.name = "Exception";
    }
});