$connStr = "Server=(localdb)\mssqllocaldb;Integrated Security=true;Encrypt=False;"
$sql = Get-Content -Path "BancoDeDados.sql" -Raw

Add-Type -AssemblyName "System.Data"
$conn = New-Object System.Data.SqlClient.SqlConnection($connStr)
$conn.Open()

$batches = $sql -split "(?im)^\s*GO\s*$"
foreach ($batch in $batches) {
    $trimmed = $batch.Trim()
    if ($trimmed.Length -gt 0) {
        $cmd = $conn.CreateCommand()
        $cmd.CommandText = $trimmed
        [void]$cmd.ExecuteNonQuery()
    }
}
$conn.Close()
Write-Host "Database db_titanium and tables created successfully!"
