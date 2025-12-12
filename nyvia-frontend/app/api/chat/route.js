export async function POST(request) {
  const body = await request.json()
  
  const response = await fetch('http://localhost:3001/api/chat', { //   URL do backend  
    // 
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json'
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