"use client"

import { Chessboard } from "react-chessboard";

import React, { useState } from "react";
import Chess from "chess.js";

export default async function BoardPage() {

	const [game, setGame] = useState(new Chess());

	return (
		<div className="flex flex-col items-center justify-center flex-grow">
			<div className="w-[400px] aspect-square">
				<Chessboard position={game.fen()}/>
			</div>
		</div>
	)
}