using System;
using Microsoft.EntityFrameworkCore;
using ChamaJussa.Models;

namespace ChamaJussa.Data;

public partial class DbTitaniumContext : DbContext
{
    public DbTitaniumContext()
    {
    }

    public DbTitaniumContext(DbContextOptions<DbTitaniumContext> options)
        : base(options)
    {
    }

    public virtual DbSet<TbPedido> TbPedidos { get; set; }

    public virtual DbSet<TbUsuario> TbUsuarios { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TbPedido>(entity =>
        {
            entity.HasKey(e => e.IdPedido).HasName("PK__tb_pedid__9D335DC3F1C42E8E");

            entity.ToTable("tb_pedido");

            entity.Property(e => e.IdPedido).HasDefaultValueSql("(newid())");
            entity.Property(e => e.DataCriacao).HasDefaultValueSql("(getutcdate())");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .HasDefaultValue("Pendente");
            entity.Property(e => e.Titulo).HasMaxLength(150);

            entity.HasOne(d => d.IdUsuarioNavigation).WithMany(p => p.TbPedidos)
                .HasForeignKey(d => d.IdUsuario)
                .HasConstraintName("FK_tb_pedido_tb_usuario");
        });

        modelBuilder.Entity<TbUsuario>(entity =>
        {
            entity.HasKey(e => e.IdUsuario).HasName("PK__tb_usuar__5B65BF97072E27CD");

            entity.ToTable("tb_usuario");

            entity.HasIndex(e => e.Email, "UQ__tb_usuar__A9D105342F5FA0BF").IsUnique();

            entity.Property(e => e.IdUsuario).HasDefaultValueSql("(newid())");
            entity.Property(e => e.DataCriacao).HasDefaultValueSql("(getutcdate())");
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.Nome).HasMaxLength(255);
            entity.Property(e => e.Perfil)
                .HasMaxLength(50)
                .HasDefaultValue("Cliente");
            entity.Property(e => e.Senha).HasMaxLength(255);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
