riot.tag('main', '<aside class="aside four columns"> <p>Menu</p> </aside> <main class="main eight columns"> <p>Main Content</p> </main>', function(opts) {
         this.on('mount', function() {
            console.log('MOUNTED!');
        })
    
});
