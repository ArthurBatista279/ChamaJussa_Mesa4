using ChamaJussa.Data;
using ChamaJussa.DTOs;
using ChamaJussa.Models;
using Microsoft.EntityFrameworkCore;

namespace ChamaJussa.Services;

public class UsuarioService : IUsuarioService
{
    private readonly DbTitaniumContext _context;
    private readonly ITokenService _tokenService;

    private static readonly string[] PerfisValidos = { "Administrador", "Funcionario", "Cliente" };

    public UsuarioService(DbTitaniumContext context, ITokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    public IEnumerable<string> ObterPerfisDisponiveis()
    {
        return PerfisValidos;
    }

    public async Task<IEnumerable<UsuarioResponseDto>> ObterTodosAsync()
    {
        return await _context.TbUsuarios
            .AsNoTracking()
            .Select(u => new UsuarioResponseDto(u.IdUsuario, u.Nome, u.Email, u.Perfil, u.DataCriacao))
            .ToListAsync();
    }

    public async Task<UsuarioResponseDto?> ObterPorIdAsync(Guid id)
    {
        var usuario = await _context.TbUsuarios
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.IdUsuario == id);

        if (usuario == null) return null;

        return new UsuarioResponseDto(usuario.IdUsuario, usuario.Nome, usuario.Email, usuario.Perfil, usuario.DataCriacao);
    }

    public async Task<UsuarioResponseDto> CriarAsync(CriarUsuarioDto dto)
    {
        var emailExiste = await _context.TbUsuarios.AnyAsync(u => u.Email.ToLower() == dto.Email.ToLower());
        if (emailExiste)
        {
            throw new InvalidOperationException("Este e-mail já está cadastrado.");
        }

        var perfilNormalizado = NormalizarPerfil(dto.Perfil);
        var senhaHash = BCrypt.Net.BCrypt.HashPassword(dto.Senha);

        var usuario = new TbUsuario
        {
            IdUsuario = Guid.NewGuid(),
            Nome = dto.Nome,
            Email = dto.Email,
            Senha = senhaHash,
            Perfil = perfilNormalizado,
            DataCriacao = DateTime.UtcNow
        };

        _context.TbUsuarios.Add(usuario);
        await _context.SaveChangesAsync();

        return new UsuarioResponseDto(usuario.IdUsuario, usuario.Nome, usuario.Email, usuario.Perfil, usuario.DataCriacao);
    }

    public async Task<UsuarioResponseDto?> AtualizarAsync(Guid id, AtualizarUsuarioDto dto)
    {
        var usuario = await _context.TbUsuarios.FirstOrDefaultAsync(u => u.IdUsuario == id);
        if (usuario == null) return null;

        var emailEmUso = await _context.TbUsuarios.AnyAsync(u => u.Email.ToLower() == dto.Email.ToLower() && u.IdUsuario != id);
        if (emailEmUso)
        {
            throw new InvalidOperationException("Outro usuário já utiliza este e-mail.");
        }

        usuario.Nome = dto.Nome;
        usuario.Email = dto.Email;
        if (!string.IsNullOrWhiteSpace(dto.Perfil))
        {
            usuario.Perfil = NormalizarPerfil(dto.Perfil);
        }

        await _context.SaveChangesAsync();

        return new UsuarioResponseDto(usuario.IdUsuario, usuario.Nome, usuario.Email, usuario.Perfil, usuario.DataCriacao);
    }

    public async Task<UsuarioResponseDto?> AtualizarPerfilAsync(Guid id, string perfil)
    {
        var usuario = await _context.TbUsuarios.FirstOrDefaultAsync(u => u.IdUsuario == id);
        if (usuario == null) return null;

        usuario.Perfil = NormalizarPerfil(perfil);
        await _context.SaveChangesAsync();

        return new UsuarioResponseDto(usuario.IdUsuario, usuario.Nome, usuario.Email, usuario.Perfil, usuario.DataCriacao);
    }

    public async Task<bool> DeletarAsync(Guid id)
    {
        var usuario = await _context.TbUsuarios.FirstOrDefaultAsync(u => u.IdUsuario == id);
        if (usuario == null) return false;

        _context.TbUsuarios.Remove(usuario);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<TokenResponseDto?> AutenticarAsync(LoginDto dto)
    {
        var usuario = await _context.TbUsuarios.FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower());
        if (usuario == null) return null;

        bool senhaValida = BCrypt.Net.BCrypt.Verify(dto.Senha, usuario.Senha);
        if (!senhaValida) return null;

        var token = _tokenService.GerarToken(usuario);
        var usuarioDto = new UsuarioResponseDto(usuario.IdUsuario, usuario.Nome, usuario.Email, usuario.Perfil, usuario.DataCriacao);

        return new TokenResponseDto(token, usuarioDto);
    }

    private static string NormalizarPerfil(string? perfil)
    {
        if (string.IsNullOrWhiteSpace(perfil)) return "Cliente";

        var p = perfil.Trim();
        if (p.Equals("ADM", StringComparison.OrdinalIgnoreCase) || p.Equals("Administrador", StringComparison.OrdinalIgnoreCase) || p.Equals("Admin", StringComparison.OrdinalIgnoreCase))
        {
            return "Administrador";
        }

        if (p.Equals("Funcionario", StringComparison.OrdinalIgnoreCase) || p.Equals("Técnico", StringComparison.OrdinalIgnoreCase) || p.Equals("Tecnico", StringComparison.OrdinalIgnoreCase))
        {
            return "Funcionario";
        }

        return "Cliente";
    }
}
