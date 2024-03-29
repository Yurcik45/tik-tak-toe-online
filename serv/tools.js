// HOC for error handling
const db_err_handling_hoc = func =>
{
  return async (...args) => {
    try {
      const result = await func(...args);
      return result;
    } 
    catch (err) { console.error('Error:', err) }
  }
}

const log_battle_rows = result =>
{
  // Extract rows and remove PostgreSQL technical information
  const rows = result.rows.map((row) => ({ ...row }));
  console.table(rows);
}

const game_query_builder = ({...params}) =>
({
  get_all: 'SELECT * FROM battles',
  get_one: `SELECT * FROM battles WHERE id=${params.id}`,
  get_one_by_name: `SELECT * FROM battles WHERE player1_name='${params.name}' OR player2_name='${params.name}'`,
  create: `
    INSERT INTO battles (player1_name, game_status, last_step_player, player1_symbol, player2_symbol)
    VALUES ('${params.player1_name}', 'search opponent', '${params.player1_name}', 'x', 'o')
    RETURNING *
  `,
  start: `
    UPDATE battles
    SET player2_name='${params.player2_name}', game_status='running'
    WHERE id=${params.id}
    RETURNING *
  `,
  update_status: `
    UPDATE battles
    SET game_status='${params.game_status}'
    WHERE id=${params.id}
    RETURNING *
  `,
  update_data: `
    UPDATE battles
    SET game_data='${JSON.stringify(params.game_data)}', last_step_player='${params.last_step_player}'
    WHERE id=${params.id}
    RETURNING *
  `,
  finish: `
    UPDATE battles
    SET
      game_status='finished',
      game_data='${JSON.stringify(params.game_data)}'
    WHERE id=${params.id}
    RETURNING *
  `,
  restart: `
    UPDATE battles
    SET
      game_status='running',
      game_data='[
        {"id": 0,"symbol": null, "acrossed": false},
        {"id": 1,"symbol": null, "acrossed": false},
        {"id": 2,"symbol": null, "acrossed": false},
        {"id": 3,"symbol": null, "acrossed": false},
        {"id": 4,"symbol": null, "acrossed": false},
        {"id": 5,"symbol": null, "acrossed": false},
        {"id": 6,"symbol": null, "acrossed": false},
        {"id": 7,"symbol": null, "acrossed": false},
        {"id": 8,"symbol": null, "acrossed": false}
      ]'
    WHERE id=${params.id}
    RETURNING *
  `,
  delete: `
    DELETE FROM battles
    WHERE id=${params.id}
    RETURNING *
  `
})

module.exports = {
  db_err_handling_hoc,
  log_battle_rows,
  game_query_builder,
}