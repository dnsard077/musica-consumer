const { Pool } = require('pg');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async getSongs(playlistId) {
    const query = {
      text: `SELECT songs.id AS songs_id, songs.title, songs.performer, playlists.id as playlists_id, playlists.name
      FROM songs
      JOIN playlistsongs
      ON songs.id = playlistsongs.song_id 
      JOIN playlists
      ON playlistsongs.playlist_id = $1
      JOIN users
      ON users.id=playlists.owner
      WHERE playlists.id = $1`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    const songs = result.rows.map((row) => ({
      id: row.songs_id,
      title: row.title,
      performer: row.performer,
    }));

    const playlist = {
      playlist: {
        id: result.rows[0].playlists_id,
        name: result.rows[0].name,
        songs,
      },
    };
    return playlist;
  }
}

module.exports = SongsService;
