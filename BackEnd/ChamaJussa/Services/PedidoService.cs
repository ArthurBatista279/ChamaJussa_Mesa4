using ChamaJussa.Data;
using ChamaJussa.DTOs;
using ChamaJussa.Models;
using Microsoft.EntityFrameworkCore;

namespace ChamaJussa.Services;

public class PedidoService : IPedidoService
{
    private readonly DbTitaniumContext _context;

    public PedidoService(DbTitaniumContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<PedidoResponseDto>> ObterTodosAsync()
    {
        return await _context.TbPedidos
            .AsNoTracking()
            .Include(p => p.IdUsuarioNavigation)
            .Select(p => new PedidoResponseDto(
                p.IdPedido,
                p.Titulo,
                p.Descricao,
                p.Status,
                p.DataCriacao,
                p.DataAtualizacao,
                p.IdUsuario,
                p.IdUsuarioNavigation.Nome
            ))
            .ToListAsync();
    }

    public async Task<PedidoResponseDto?> ObterPorIdAsync(Guid id)
    {
        var pedido = await _context.TbPedidos
            .AsNoTracking()
            .Include(p => p.IdUsuarioNavigation)
            .FirstOrDefaultAsync(p => p.IdPedido == id);

        if (pedido == null) return null;

        return new PedidoResponseDto(
            pedido.IdPedido,
            pedido.Titulo,
            pedido.Descricao,
            pedido.Status,
            pedido.DataCriacao,
            pedido.DataAtualizacao,
            pedido.IdUsuario,
            pedido.IdUsuarioNavigation?.Nome
        );
    }

    public async Task<IEnumerable<PedidoResponseDto>> ObterPorUsuarioAsync(Guid idUsuario)
    {
        return await _context.TbPedidos
            .AsNoTracking()
            .Include(p => p.IdUsuarioNavigation)
            .Where(p => p.IdUsuario == idUsuario)
            .Select(p => new PedidoResponseDto(
                p.IdPedido,
                p.Titulo,
                p.Descricao,
                p.Status,
                p.DataCriacao,
                p.DataAtualizacao,
                p.IdUsuario,
                p.IdUsuarioNavigation.Nome
            ))
            .ToListAsync();
    }

    public async Task<PedidoResponseDto> CriarAsync(CriarPedidoDto dto)
    {
        var usuarioExiste = await _context.TbUsuarios.AnyAsync(u => u.IdUsuario == dto.IdUsuario);
        if (!usuarioExiste)
        {
            throw new InvalidOperationException("Usuário informado não existe.");
        }

        var pedido = new TbPedido
        {
            IdPedido = Guid.NewGuid(),
            Titulo = dto.Titulo,
            Descricao = dto.Descricao,
            Status = "Pendente",
            DataCriacao = DateTime.UtcNow,
            IdUsuario = dto.IdUsuario
        };

        _context.TbPedidos.Add(pedido);
        await _context.SaveChangesAsync();

        var usuario = await _context.TbUsuarios.FindAsync(dto.IdUsuario);

        return new PedidoResponseDto(
            pedido.IdPedido,
            pedido.Titulo,
            pedido.Descricao,
            pedido.Status,
            pedido.DataCriacao,
            pedido.DataAtualizacao,
            pedido.IdUsuario,
            usuario?.Nome
        );
    }

    public async Task<PedidoResponseDto?> AtualizarAsync(Guid id, AtualizarPedidoDto dto)
    {
        var pedido = await _context.TbPedidos
            .Include(p => p.IdUsuarioNavigation)
            .FirstOrDefaultAsync(p => p.IdPedido == id);

        if (pedido == null) return null;

        pedido.Titulo = dto.Titulo;
        pedido.Descricao = dto.Descricao;
        pedido.Status = dto.Status;
        pedido.DataAtualizacao = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new PedidoResponseDto(
            pedido.IdPedido,
            pedido.Titulo,
            pedido.Descricao,
            pedido.Status,
            pedido.DataCriacao,
            pedido.DataAtualizacao,
            pedido.IdUsuario,
            pedido.IdUsuarioNavigation?.Nome
        );
    }

    public async Task<PedidoResponseDto?> AtualizarStatusAsync(Guid id, string status)
    {
        var pedido = await _context.TbPedidos
            .Include(p => p.IdUsuarioNavigation)
            .FirstOrDefaultAsync(p => p.IdPedido == id);

        if (pedido == null) return null;

        pedido.Status = status;
        pedido.DataAtualizacao = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new PedidoResponseDto(
            pedido.IdPedido,
            pedido.Titulo,
            pedido.Descricao,
            pedido.Status,
            pedido.DataCriacao,
            pedido.DataAtualizacao,
            pedido.IdUsuario,
            pedido.IdUsuarioNavigation?.Nome
        );
    }

    public async Task<bool> DeletarAsync(Guid id)
    {
        var pedido = await _context.TbPedidos.FirstOrDefaultAsync(p => p.IdPedido == id);
        if (pedido == null) return false;

        _context.TbPedidos.Remove(pedido);
        await _context.SaveChangesAsync();
        return true;
    }
}
