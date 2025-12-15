export async function GET(request) {
  const token = request.headers.get('Authorization')
  
  const response = await fetch('http://localhost:3001/workspaces', {
    method: 'GET',
    headers: {
      'Authorization': token || '',
      'Content-Type': 'application/json'
    }
  })
  
  const data = await response.json()
  return Response.json(data)
}