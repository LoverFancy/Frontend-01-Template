// https://github.com/login/oauth/authorize?client_id=Iv1.99fc6202d3e82a0a&redirect_uri=http%3A%2F%2Flocalhost%3A8000&scope=read%3Auser&state=321cba

const ft = async () => {
  let code = "7fcf69214d079b967315"
  let state = "321cba"
  let client_secret = "0b8782216a211ac350035367875f68fa9e76cee8"
  let client_id = "Iv1.99fc6202d3e82a0a"
  let redirect_uri = "http%3A%2F%2Flocalhost%3A8000";

  let scope = encodeURIComponent('read:user')

  const getCode = `client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&state=${state}`

  await fetch(`https://github.com/login/oauth/authorize?${getCode}`, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    redirect: 'manual'
  }).then(r => r.url)

  const getAuthToken = `code=${code}&client_secret=${client_secret}&` + getCode

  fetch(`https://github.com/login/oauth/access_token?${getAuthToken}`, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: "no-cors",
    headers: {
      Accept: 'application/json'
    }
  })
    .then(response => response.json())

  fetch("https://api.github.com/user", {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    headers: {
      Authorization: "token 1348715525f5438931796978a554d6d8297b4c42"
    }
  })
}
