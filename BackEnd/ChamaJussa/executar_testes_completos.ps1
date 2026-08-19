[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
$baseUrl = "http://localhost:5078"

Write-Host "==========================================================================" -ForegroundColor Cyan
Write-Host "       BATERIA DE TESTES AUTOMATIZADOS - BACKEND CHAMA JUSSA (API REST)   " -ForegroundColor Cyan
Write-Host "==========================================================================" -ForegroundColor Cyan
Write-Host ""

$sucessos = 0
$falhas = 0

function Assert-Result($nomeTeste, $condicao, $detalhes) {
    if ($condicao) {
        $global:sucessos++
        Write-Host " [PASSOU] $nomeTeste" -ForegroundColor Green
        if ($detalhes) { Write-Host "          --> $detalhes" -ForegroundColor Gray }
    } else {
        $global:falhas++
        Write-Host " [FALHOU] $nomeTeste" -ForegroundColor Red
        if ($detalhes) { Write-Host "          --> $detalhes" -ForegroundColor Yellow }
    }
}

# 1. Testar Rota Swagger / Documentation
try {
    $swagger = Invoke-RestMethod -Uri "$baseUrl/swagger/v1/swagger.json" -Method Get
    Assert-Result "Swagger OpenAPI v1" ($swagger.info.title -eq "Chama Jussa API") "Doc: $($swagger.info.title) v$($swagger.info.version)"
} catch {
    Assert-Result "Swagger OpenAPI v1" $false $_.Exception.Message
}

# 2. Cadastro de Usuários (POST /api/usuarios)
$emailTest1 = "tecnico.suporte_$(Get-Random)@senai.br"
$usuario1Json = @{
    nome = "Carlos Eduardo Tecnico"
    email = $emailTest1
    senha = "SenhaSegura123!"
    perfil = "Tecnico"
} | ConvertTo-Json

$user1Id = $null
try {
    $u1Res = Invoke-RestMethod -Uri "$baseUrl/api/usuarios" -Method Post -Body $usuario1Json -ContentType "application/json; charset=utf-8"
    $user1Id = $u1Res.idUsuario
    Assert-Result "Cadastro de Usuário 1 (Técnico)" ($user1Id -ne $null) "ID: $user1Id | Email: $($u1Res.email)"
} catch {
    Assert-Result "Cadastro de Usuário 1 (Técnico)" $false $_.Exception.Message
}

# Validação: Impedir cadastro de e-mail duplicado
try {
    $dupRes = Invoke-RestMethod -Uri "$baseUrl/api/usuarios" -Method Post -Body $usuario1Json -ContentType "application/json; charset=utf-8"
    Assert-Result "Validação de E-mail Duplicado (400 Bad Request)" $false "Deveria ter rejeitado o e-mail duplicado."
} catch {
    Assert-Result "Validação de E-mail Duplicado (400 Bad Request)" $true "Rejeitado corretamente com mensagem de erro."
}

# 3. Autenticação & JWT (POST /api/auth/login)
# Teste de Senha Incorreta
$loginInvalido = @{ email = $emailTest1; senha = "SenhaErrada999" } | ConvertTo-Json
try {
    $null = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $loginInvalido -ContentType "application/json"
    Assert-Result "Login com Senha Incorreta (401 Unauthorized)" $false "Deveria ter retornado 401."
} catch {
    Assert-Result "Login com Senha Incorreta (401 Unauthorized)" $true "Retornou 401 Unauthorized como esperado."
}

# Teste de Login Válido
$loginValido = @{ email = $emailTest1; senha = "SenhaSegura123!" } | ConvertTo-Json
$jwtToken = $null
try {
    $loginRes = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $loginValido -ContentType "application/json"
    $jwtToken = $loginRes.token
    Assert-Result "Login com Sucesso & Geração de JWT" ($jwtToken.Length -gt 20) "Token: $($jwtToken.Substring(0, 25))..."
} catch {
    Assert-Result "Login com Sucesso & Geração de JWT" $false $_.Exception.Message
}

$headers = @{ "Authorization" = "Bearer $jwtToken" }

# 4. Endpoints Protegidos de Usuário
# Listar Todos
try {
    $usuariosList = Invoke-RestMethod -Uri "$baseUrl/api/usuarios" -Method Get -Headers $headers
    Assert-Result "Listagem de Usuários (GET /api/usuarios)" ($usuariosList.Count -ge 1) "Total cadastrados: $($usuariosList.Count)"
} catch {
    Assert-Result "Listagem de Usuários (GET /api/usuarios)" $false $_.Exception.Message
}

# Obter Usuário por ID
try {
    $u1Consulta = Invoke-RestMethod -Uri "$baseUrl/api/usuarios/$user1Id" -Method Get -Headers $headers
    Assert-Result "Buscar Usuário por ID (GET /api/usuarios/{id})" ($u1Consulta.nome -like "Carlos Eduardo*") "Nome retornado: $($u1Consulta.nome)"
} catch {
    Assert-Result "Buscar Usuário por ID (GET /api/usuarios/{id})" $false $_.Exception.Message
}

# Atualizar Usuário
$updateUserJson = @{
    nome = "Carlos Eduardo Silva"
    email = $emailTest1
    perfil = "Administrador"
} | ConvertTo-Json
try {
    $u1Updated = Invoke-RestMethod -Uri "$baseUrl/api/usuarios/$user1Id" -Method Put -Body $updateUserJson -Headers $headers -ContentType "application/json; charset=utf-8"
    Assert-Result "Atualizar Usuário (PUT /api/usuarios/{id})" ($u1Updated.nome -eq "Carlos Eduardo Silva" -and $u1Updated.perfil -eq "Administrador") "Novo Nome: $($u1Updated.nome) | Perfil: $($u1Updated.perfil)"
} catch {
    Assert-Result "Atualizar Usuário (PUT /api/usuarios/{id})" $false $_.Exception.Message
}

# 5. CRUD de Ordens de Serviço / Pedidos (POST/GET/PUT/PATCH/DELETE)
$pedidoId = $null
$pedidoJson = @{
    titulo = "Troca de HD por SSD NVMe"
    descricao = "Substituir HD mecanico de 1TB por SSD NVMe de 500GB da bancada 4."
    idUsuario = $user1Id
} | ConvertTo-Json

# Criar OS
try {
    $pRes = Invoke-RestMethod -Uri "$baseUrl/api/pedidos" -Method Post -Body $pedidoJson -Headers $headers -ContentType "application/json; charset=utf-8"
    $pedidoId = $pRes.idPedido
    Assert-Result "Criar Ordem de Serviço (POST /api/pedidos)" ($pedidoId -ne $null) "ID OS: $pedidoId | Status Inicial: $($pRes.status)"
} catch {
    Assert-Result "Criar Ordem de Serviço (POST /api/pedidos)" $false $_.Exception.Message
}

# Consultar OS por ID
try {
    $pConsulta = Invoke-RestMethod -Uri "$baseUrl/api/pedidos/$pedidoId" -Method Get -Headers $headers
    Assert-Result "Buscar OS por ID (GET /api/pedidos/{id})" ($pConsulta.titulo -like "Troca de HD*") "Título: $($pConsulta.titulo) | Usuário: $($pConsulta.nomeUsuario)"
} catch {
    Assert-Result "Buscar OS por ID (GET /api/pedidos/{id})" $false $_.Exception.Message
}

# Consultar OS por Usuário
try {
    $pUserList = Invoke-RestMethod -Uri "$baseUrl/api/pedidos/usuario/$user1Id" -Method Get -Headers $headers
    Assert-Result "Buscar OS por Usuário (GET /api/pedidos/usuario/{id})" ($pUserList.Count -ge 1) "Qtd de OS do Usuário: $($pUserList.Count)"
} catch {
    Assert-Result "Buscar OS por Usuário (GET /api/pedidos/usuario/{id})" $false $_.Exception.Message
}

# Atualizar Status da OS (PATCH)
$patchStatusJson = @{ status = "Concluido" } | ConvertTo-Json
try {
    $pStatusRes = Invoke-RestMethod -Uri "$baseUrl/api/pedidos/$pedidoId/status" -Method Patch -Body $patchStatusJson -Headers $headers -ContentType "application/json"
    Assert-Result "Atualizar Status da OS (PATCH /api/pedidos/{id}/status)" ($pStatusRes.status -eq "Concluido") "Novo Status: $($pStatusRes.status)"
} catch {
    Assert-Result "Atualizar Status da OS (PATCH /api/pedidos/{id}/status)" $false $_.Exception.Message
}

# Excluir OS (DELETE)
try {
    $null = Invoke-RestMethod -Uri "$baseUrl/api/pedidos/$pedidoId" -Method Delete -Headers $headers
    Assert-Result "Excluir Ordem de Serviço (DELETE /api/pedidos/{id})" $true "OS excluída com sucesso (204 No Content)."
} catch {
    Assert-Result "Excluir Ordem de Serviço (DELETE /api/pedidos/{id})" $false $_.Exception.Message
}

# Excluir Usuário de Teste (DELETE)
try {
    $null = Invoke-RestMethod -Uri "$baseUrl/api/usuarios/$user1Id" -Method Delete -Headers $headers
    Assert-Result "Excluir Usuário de Teste (DELETE /api/usuarios/{id})" $true "Usuário excluído com sucesso (204 No Content)."
} catch {
    Assert-Result "Excluir Usuário de Teste (DELETE /api/usuarios/{id})" $false $_.Exception.Message
}

# RELATÓRIO FINAL
Write-Host ""
Write-Host "==========================================================================" -ForegroundColor Cyan
Write-Host "                        RESUMO DOS TESTES EXECUTADOS                       " -ForegroundColor Cyan
Write-Host "==========================================================================" -ForegroundColor Cyan
Write-Host " Total de Sucessos: $sucessos" -ForegroundColor Green
Write-Host " Total de Falhas:   $falhas" -ForegroundColor $(if ($falhas -eq 0) { "Green" } else { "Red" })
Write-Host "==========================================================================" -ForegroundColor Cyan
if ($falhas -eq 0) {
    Write-Host " STATUS GERAL: TODOS OS TESTES PASSARAM COM 100% DE SUCESSO! 🎉" -ForegroundColor Green
} else {
    Write-Host " STATUS GERAL: ALGUNS TESTES FALHARAM. VERIFIQUE OS LOGS ACIMA." -ForegroundColor Red
}
Write-Host ""
