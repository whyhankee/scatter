riot.tag('core', '<div class="row"> <aside class="aside four columns"> <p>Menu</p> </aside> <main class="main eight columns"> <p>Main Content</p> </main> </div>', function(opts) {
        this.on('mount', function() {
            console.log('MOUNTED!');
        });
    
});
