using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace myapp_backend.Migrations
{
    /// <inheritdoc />
    public partial class AddLevelMasteryTest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "LevelMasteryTestId",
                table: "Questions",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "LevelMasteryTests",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    LevelId = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    TimeLimitMinutes = table.Column<int>(type: "integer", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LevelMasteryTests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LevelMasteryTests_Levels_LevelId",
                        column: x => x.LevelId,
                        principalTable: "Levels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Questions_LevelMasteryTestId",
                table: "Questions",
                column: "LevelMasteryTestId");

            migrationBuilder.CreateIndex(
                name: "IX_LevelMasteryTests_LevelId",
                table: "LevelMasteryTests",
                column: "LevelId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Questions_LevelMasteryTests_LevelMasteryTestId",
                table: "Questions",
                column: "LevelMasteryTestId",
                principalTable: "LevelMasteryTests",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Questions_LevelMasteryTests_LevelMasteryTestId",
                table: "Questions");

            migrationBuilder.DropTable(
                name: "LevelMasteryTests");

            migrationBuilder.DropIndex(
                name: "IX_Questions_LevelMasteryTestId",
                table: "Questions");

            migrationBuilder.DropColumn(
                name: "LevelMasteryTestId",
                table: "Questions");
        }
    }
}
