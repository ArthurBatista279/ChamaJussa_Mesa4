using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using ChamaJussa.Models;
using ChamaJussa.Services;
using Microsoft.Extensions.Configuration;
using Xunit;

namespace ChamaJussa.Tests.Services;

public class TokenServiceTests
{
    [Fact]
    public void GerarToken_ComChaveValida_DeveGerarJwtTokenComClaimsCorretas()
    {
        // Arrange
        var inMemorySettings = new Dictionary<string, string?>
        {
            { "Jwt:SecretKey", "SuperChaveSecretaMuitoLongaEProtegida12345!" },
            { "Jwt:Issuer", "ChamaJussaTestIssuer" },
            { "Jwt:Audience", "ChamaJussaTestAudience" }
        };

        IConfiguration configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings)
            .Build();

        var service = new TokenService(configuration);

        var usuario = new TbUsuario
        {
            IdUsuario = Guid.NewGuid(),
            Nome = "Carlos Teste",
            Email = "carlos@teste.com",
            Perfil = "Administrador"
        };

        // Act
        var tokenString = service.GerarToken(usuario);

        // Assert
        Assert.False(string.IsNullOrWhiteSpace(tokenString));

        var handler = new JwtSecurityTokenHandler();
        var jwtToken = handler.ReadJwtToken(tokenString);

        Assert.Equal("ChamaJussaTestIssuer", jwtToken.Issuer);

        var nameIdClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        var emailClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        var roleClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;

        Assert.Equal(usuario.IdUsuario.ToString(), nameIdClaim);
        Assert.Equal("carlos@teste.com", emailClaim);
        Assert.Equal("Administrador", roleClaim);
    }

    [Fact]
    public void GerarToken_SemChaveSecreta_DeveLancarExcecao()
    {
        // Arrange
        var inMemorySettings = new Dictionary<string, string?>();
        IConfiguration configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings)
            .Build();

        var service = new TokenService(configuration);

        var usuario = new TbUsuario
        {
            IdUsuario = Guid.NewGuid(),
            Nome = "Teste",
            Email = "teste@email.com",
            Perfil = "Cliente"
        };

        // Act & Assert
        var ex = Assert.Throws<InvalidOperationException>(() => service.GerarToken(usuario));
        Assert.Contains("Jwt:SecretKey", ex.Message);
    }
}
