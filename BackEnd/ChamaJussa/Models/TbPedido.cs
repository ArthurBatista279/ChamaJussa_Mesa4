using System;

namespace ChamaJussa.Models;

public partial class TbPedido
{
    public Guid IdPedido { get; set; }

    public string Titulo { get; set; } = null!;

    public string Descricao { get; set; } = null!;

    public string Status { get; set; } = null!;

    public DateTime DataCriacao { get; set; }

    public DateTime? DataAtualizacao { get; set; }

    public Guid IdUsuario { get; set; }

    public virtual TbUsuario IdUsuarioNavigation { get; set; } = null!;
}
