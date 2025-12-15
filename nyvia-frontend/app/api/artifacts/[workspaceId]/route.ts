export async function GET(
  request: Request,
  { params }: { params: { workspaceId: string } }
) {
  const token = request.headers.get('Authorization')
  
  const response = await fetch(`http://localhost:3001/artifacts/${params.workspaceId}`, {
    method: 'GET',
    headers: {
      'Authorization': token || '',
      'Content-Type': 'application/json'
    }
  })
  
  const data = await response.json()
  return Response.json(data)
}

export async function POST(
  request: Request,
  { params }: { params: { workspaceId: string } }
) {
  const token = request.headers.get('Authorization')
  const formData = await request.formData()
  
  const response = await fetch(`http://localhost:3001/artifacts/${params.workspaceId}`, {
    method: 'POST',
    headers: {
      'Authorization': token || ''
    },
    body: formData
  })
  
  const data = await response.json()
  return Response.json(data, { status: response.status })
}

export async function DELETE(request: Request) {
  const token = request.headers.get('Authorization')
  const { id } = await request.json()
  
  const response = await fetch(`http://localhost:3001/artifacts/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': token || '',
      'Content-Type': 'application/json'
    }
  })
  
  const data = await response.json()
  return Response.json(data)
}