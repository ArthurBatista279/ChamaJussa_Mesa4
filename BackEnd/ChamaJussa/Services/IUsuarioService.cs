using ChamaJussa.DTOs;

namespace ChamaJussa.Services;

public interface IUsuarioService
{
    Task<IEnumerable<UsuarioResponseDto>> ObterTodosAsync();
    Task<UsuarioResponseDto?> ObterPorIdAsync(Guid id);
    Task<UsuarioResponseDto> CriarAsync(CriarUsuarioDto dto);
    Task<UsuarioResponseDto?> AtualizarAsync(Guid id, AtualizarUsuarioDto dto);
    Task<UsuarioResponseDto?> AtualizarPerfilAsync(Guid id, string perfil);
    Task<bool> DeletarAsync(Guid id);
    Task<TokenResponseDto?> AutenticarAsync(LoginDto dto);
    IEnumerable<string> ObterPerfisDisponiveis();
}
