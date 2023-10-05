export default function persisted(options = { key: 'store' }) {
  return store => {
    let Storage = JSON.parse(localStorage.getItem(options.key))
    Storage && store.replaceState(Storage)
    Storage = null
    store.subscribe((mutation, state) => {
      localStorage.setItem(options.key, JSON.stringify(state))
    })
  }
}
