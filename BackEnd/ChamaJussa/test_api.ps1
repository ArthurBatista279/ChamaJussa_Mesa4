$baseUrl = "http://localhost:5078"

Write-Host "--- Testando API Backend Chama Jussa ---"

# 1. Testar Swagger UI / OpenAPI
try {
    $swagger = Invoke-RestMethod -Uri "$baseUrl/swagger/v1/swagger.json" -Method Get
    Write-Host "[OK] Swagger OpenAPI v1 acessível! Título: '$($swagger.info.title)'"
} catch {
    Write-Host "[ERRO] Falha ao acessar o Swagger OpenAPI." $_.Exception.Message
}

# 2. Criar Usuário
$novoUsuario = @{
    nome = "Arthur Batista"
    email = "arthur.teste@senai.br"
    senha = "SenhaSegura123!"
    perfil = "Cliente"
} | ConvertTo-Json

try {
    $userRes = Invoke-RestMethod -Uri "$baseUrl/api/usuarios" -Method Post -Body $novoUsuario -ContentType "application/json"
    $userId = $userRes.idUsuario
    Write-Host "[OK] Usuário criado com Sucesso! ID: $userId | Nome: $($userRes.nome)"
} catch {
    Write-Host "[AVISO/ERRO ao criar usuário]:" $_.Exception.Message
}

# 3. Autenticação (Login) JWT
$loginBody = @{
    email = "arthur.teste@senai.br"
    senha = "SenhaSegura123!"
} | ConvertTo-Json

$token = ""
try {
    $loginRes = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginRes.token
    Write-Host "[OK] Login autenticado com sucesso! Token JWT gerado: $($token.Substring(0, 30))..."
} catch {
    Write-Host "[ERRO no Login]:" $_.Exception.Message
}

# Headers com Token JWT
$headers = @{
    "Authorization" = "Bearer $token"
}

# 4. Criar Ordem de Serviço (Pedido)
if ($userId -and $token) {
    $novoPedido = @{
        titulo = "Manutenção de Servidor"
        descricao = "Verificação de espaço em disco e atualização de segurança no servidor principal."
        idUsuario = $userId
    } | ConvertTo-Json

    try {
        $pedidoRes = Invoke-RestMethod -Uri "$baseUrl/api/pedidos" -Method Post -Body $novoPedido -Headers $headers -ContentType "application/json"
        $pedidoId = $pedidoRes.idPedido
        Write-Host "[OK] Ordem de Serviço criada com sucesso! ID: $pedidoId | Título: $($pedidoRes.titulo) | Status: $($pedidoRes.status)"
    } catch {
        Write-Host "[ERRO ao criar Ordem de Serviço]:" $_.Exception.Message
    }

    # 5. Listar Ordens de Serviço
    try {
        $pedidosList = Invoke-RestMethod -Uri "$baseUrl/api/pedidos" -Method Get -Headers $headers
        Write-Host "[OK] Listagem de Ordens de Serviço retornou $($pedidosList.Count) registro(s)."
    } catch {
        Write-Host "[ERRO ao listar Ordens de Serviço]:" $_.Exception.Message
    }

    # 6. Atualizar Status da OS
    if ($pedidoId) {
        $updateStatus = @{
            status = "EmAndamento"
        } | ConvertTo-Json

        try {
            $statusRes = Invoke-RestMethod -Uri "$baseUrl/api/pedidos/$pedidoId/status" -Method Patch -Body $updateStatus -Headers $headers -ContentType "application/json"
            Write-Host "[OK] Status da OS atualizado com sucesso! Novo Status: $($statusRes.status)"
        } catch {
            Write-Host "[ERRO ao atualizar status da OS]:" $_.Exception.Message
        }
    }
}

Write-Host "--- Testes Concluídos ---"
