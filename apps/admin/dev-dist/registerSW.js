if('serviceWorker' in navigator) navigator.serviceWorker.register('/admin/dev-sw.js?dev-sw', { scope: '/admin/', type: 'classic' })