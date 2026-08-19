using ChamaJussa.DTOs;

namespace ChamaJussa.Services;

public interface IPedidoService
{
    Task<IEnumerable<PedidoResponseDto>> ObterTodosAsync();
    Task<PedidoResponseDto?> ObterPorIdAsync(Guid id);
    Task<IEnumerable<PedidoResponseDto>> ObterPorUsuarioAsync(Guid idUsuario);
    Task<PedidoResponseDto> CriarAsync(CriarPedidoDto dto);
    Task<PedidoResponseDto?> AtualizarAsync(Guid id, AtualizarPedidoDto dto);
    Task<PedidoResponseDto?> AtualizarStatusAsync(Guid id, string status);
    Task<bool> DeletarAsync(Guid id);
}
