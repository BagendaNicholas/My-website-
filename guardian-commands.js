cat > guardian-commands.js << 'EOF'
    // Force-load core Guardian Edition plugins
    const corePlugins = ['ping', 'allmenu', 'owner', 'alive'];
    
    console.log('️ [Guardian] Loading core commands...');
    corePlugins.forEach(name => {
        try {
            require(`./plugins/${name}.js`);
            console.log(`✅ [Guardian] Loaded ${name}.js`);
        } catch(e) {
            console.log(`❌ [Guardian] Failed ${name}.js:`, e.message);
        }
    });
    
    // Verify registration
    const redx = require('./redx');
    console.log(`📊 [Guardian] Total registered commands: ${redx.commands.length}`);
    if (redx.commands.length === 0) {
        console.warn('⚠️ [Guardian] WARNING: No commands registered! Check plugin syntax.');
    }
    EOF
