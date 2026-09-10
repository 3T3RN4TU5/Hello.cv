import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { hiddenProject } from '../data/projects.js';

const COLS = 7;
const ROWS = 6;

const emptyBoard = () => Array.from({ length: ROWS }, () => Array(COLS).fill(0));

function dropRow(board, col) {
  for (let r = ROWS - 1; r >= 0; r--) if (board[r][col] === 0) return r;
  return -1;
}

function checkWin(board, player) {
  const dirs = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] !== player) continue;
      for (const [dr, dc] of dirs) {
        let n = 1;
        while (
          n < 4 &&
          r + dr * n >= 0 &&
          r + dr * n < ROWS &&
          c + dc * n >= 0 &&
          c + dc * n < COLS &&
          board[r + dr * n][c + dc * n] === player
        ) {
          n += 1;
        }
        if (n >= 4) return true;
      }
    }
  }
  return false;
}

const boardFull = (board) => board[0].every((v) => v !== 0);

/**
 * Easter egg #4 — a playable nod to a real, verified repository:
 * github.com/Jeevan2410/Connect-4-game (vanilla JavaScript).
 * Local two-player; the real thing lives in the repo.
 */
export default function ConnectFour({ open, onClose }) {
  const [board, setBoard] = useState(emptyBoard);
  const [turn, setTurn] = useState(1);
  const [winner, setWinner] = useState(0);

  const reset = useCallback(() => {
    setBoard(emptyBoard());
    setTurn(1);
    setWinner(0);
  }, []);

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.classList.add('no-scroll');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('no-scroll');
    };
  }, [open, onClose]);

  const play = (col) => {
    if (winner) return;
    const r = dropRow(board, col);
    if (r === -1) return;
    const next = board.map((row, ri) => row.map((v, ci) => (ri === r && ci === col ? turn : v)));
    setBoard(next);
    if (checkWin(next, turn)) setWinner(turn);
    else if (boardFull(next)) setWinner(-1);
    else setTurn(turn === 1 ? 2 : 1);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            className="modal-panel c4"
            role="dialog"
            aria-modal="true"
            aria-label="Connect 4 — hidden project"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mono" style={{ color: 'var(--cyan)', fontSize: '0.75rem', letterSpacing: '0.22em' }}>
              HIDDEN PROJECT UNLOCKED
            </p>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem' }}>Connect 4</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.88rem', maxWidth: '46ch', textAlign: 'center' }}>
              {hiddenProject.note} Local two-player build — click a column to drop.
            </p>

            <div className="c4-board" role="grid" aria-label="Connect 4 board">
              {board.map((row, r) =>
                row.map((v, c) => (
                  <button
                    key={`${r}-${c}`}
                    className="c4-cell"
                    role="gridcell"
                    aria-label={`Column ${c + 1}, row ${r + 1}${v ? `, player ${v}` : ', empty'}`}
                    onClick={() => play(c)}
                  >
                    {v !== 0 && <span className={`c4-coin p${v}`} aria-hidden="true" />}
                  </button>
                ))
              )}
            </div>

            <p className={`c4-status ${winner ? 'win' : ''}`} aria-live="polite">
              {winner === -1
                ? 'Board full — draw.'
                : winner
                  ? `Player ${winner === 1 ? 'one (blue)' : 'two (violet)'} wins!`
                  : `Player ${turn === 1 ? 'one (blue)' : 'two (violet)'}'s turn`}
            </p>

            <div className="c4-actions">
              <button className="btn btn-ghost" onClick={reset}>
                Reset
              </button>
              <button className="btn btn-primary" onClick={onClose}>
                Close
              </button>
            </div>

            <p className="c4-repo">
              the real one lives at{' '}
              <a href={hiddenProject.repo} target="_blank" rel="noreferrer">
                github.com/Jeevan2410/Connect-4-game
              </a>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
