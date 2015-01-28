riot.tag('login', '<h1>{ page.title }</h1> <form id="login" onsubmit="{ submit }"> <input name="username"> <input name="password"> <button name="submit"> </form>', function(opts) {
    var form = this.login,
        username = this.username.value,
        password = this.password.value,
        button = this.submit

    this.submit = function(e) {
        console.log('Hallo');
    }.bind(this);

});
