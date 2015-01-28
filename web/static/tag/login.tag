<login>
    <h1>{ page.title }</h1>

    <form id="login" onsubmit={ submit }>
        <input name="username">
        <input name="password">
        <button name="submit">
    </form>

      // grab above HTML elements
    var form = this.login,
        username = this.username.value,
        password = this.password.value,
        button = this.submit

    submit(e) {
        console.log('Hallo');
    }
</login>
