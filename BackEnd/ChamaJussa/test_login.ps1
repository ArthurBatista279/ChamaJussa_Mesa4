$json = '{"email":"Rafa@gmail.com","senha":"Rafa20"}'
try {
    $res = Invoke-RestMethod -Uri "http://localhost:5078/api/auth/login" -Method Post -Body $json -ContentType "application/json"
    Write-Host "TOKEN_SUCESSO:" $res.token
} catch {
    Write-Host "ERRO_LOGIN:" $_.Exception.Message
}
