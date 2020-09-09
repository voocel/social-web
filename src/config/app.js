let socket_url
let socket_port
const project_name = 'chat'
const expires = 60 * 60 * 24
if (process.env.NODE_ENV === 'development') {
  socket_url = '127.0.0.1'
  socket_port = '8000'
} else {
  socket_url = '118.24.113.11'
  socket_port = '9800'
}
export default {
  project_name,
  expires,
  socket_url,
  socket_port
}
