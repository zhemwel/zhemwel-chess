"use client"

import type { Position } from "@/lib/chess-logic"

interface ChessBoardProps {
  onSquareClick: (row: number, col: number) => void
  selectedSquare: Position | null
}

export default function ChessBoard({ onSquareClick, selectedSquare }: ChessBoardProps) {
  const squares = []

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const isLight = (row + col) % 2 === 0
      const isSelected = selectedSquare?.row === row && selectedSquare?.col === col

      squares.push(
        <mesh key={`${row}-${col}`} position={[col - 3.5, 0, row - 3.5]} onClick={() => onSquareClick(row, col)}>
          <boxGeometry args={[1, 0.1, 1]} />
          <meshLambertMaterial color={isSelected ? "#ffd700" : isLight ? "#f0d9b5" : "#b58863"} />
        </mesh>,
      )
    }
  }

  return (
    <group>
      {squares}
      {/* Board Border */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[9, 0.2, 9]} />
        <meshLambertMaterial color="#8b4513" />
      </mesh>
    </group>
  )
}
