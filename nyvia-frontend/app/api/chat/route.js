export async function POST(request) {
  const body = await request.json()
  const token = request.headers.get('Authorization')
  console.log('🔑 Token recebido:', token)
  
  const response = await fetch('http://localhost:3001/api/chat', {
    // 
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': token || ''
    },
    body: JSON.stringify(body)
  })
  
  return new Response(response.body, {
    headers: { 
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  })
}