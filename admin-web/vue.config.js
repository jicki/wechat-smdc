module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://smdc-app:8080',
        changeOrigin: true
      }
    }
  }
} 