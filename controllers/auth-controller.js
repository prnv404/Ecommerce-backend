const register = async (req, res) => {
  res.send('Hello from Register')
}
const login = async (req, res) => {
  res.send('Hello from Login')
}
const logout = async (req, res) => {
  res.send('Hello from Logout')
}

module.exports = {
  register,
  login,
  logout,
}
