using System;
using System.Collections.Generic;

namespace ChamaJussa.Models;

public partial class TbUsuario
{
    public Guid IdUsuario { get; set; }

    public string Nome { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Senha { get; set; } = null!;

    public string Perfil { get; set; } = null!;

    public DateTime DataCriacao { get; set; }

    public virtual ICollection<TbPedido> TbPedidos { get; set; } = new List<TbPedido>();
}
