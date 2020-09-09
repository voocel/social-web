export default function persisted(options = { key: 'store' }) {
  return store => {
    let sessionStore = JSON.parse(sessionStorage.getItem(options.key))
    sessionStore && store.replaceState(sessionStore)
    sessionStore = null
    store.subscribe((mutation, state) => {
      sessionStorage.setItem(options.key, JSON.stringify(state))
    })
  }
}
