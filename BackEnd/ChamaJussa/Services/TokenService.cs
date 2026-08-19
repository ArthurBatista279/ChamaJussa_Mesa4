using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ChamaJussa.Models;
using Microsoft.IdentityModel.Tokens;

namespace ChamaJussa.Services;

public class TokenService : ITokenService
{
    private readonly IConfiguration _configuration;

    public TokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GerarToken(TbUsuario usuario)
    {
        var secretKey = _configuration["Jwt:SecretKey"] ?? "ChamaJussaSuperSecretKey2026_SENAI_Mesa4!";
        var issuer = _configuration["Jwt:Issuer"] ?? "ChamaJussaAPI";
        var audience = _configuration["Jwt:Audience"] ?? "ChamaJussaApp";

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, usuario.IdUsuario.ToString()),
            new Claim(ClaimTypes.Name, usuario.Nome),
            new Claim(ClaimTypes.Email, usuario.Email),
            new Claim(ClaimTypes.Role, usuario.Perfil ?? "Cliente")
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
